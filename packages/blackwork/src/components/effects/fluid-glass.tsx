'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/utils'
import { type FluidRect, nearestRect, springStep } from './fluid-glass-math'
import { GlassSurface } from './glass-surface'

export interface FluidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Draw a glass track behind the moving lens. */
  surface?: boolean
  variant?: 'glass' | 'subtle'
}

const itemSelector = '[data-fluid-glass-item]'
const keys = ['x', 'y', 'width', 'height'] as const

/** Mark links/buttons with data-fluid-glass-item; aria-current/aria-selected parks the lens. */
export const FluidGlass: React.FC<FluidGlassProps> = ({
  children,
  className,
  surface = true,
  variant = 'glass',
  ...props
}) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const lens = lensRef.current
    if (!root || !lens) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let items: HTMLElement[] = []
    let rects: FluidRect[] = []
    let target: FluidRect | null = null
    let current: FluidRect | null = null
    let velocity = { x: 0, y: 0, width: 0, height: 0 }
    let hovered: HTMLElement | null = null
    let frame = 0
    let measurement = 0
    let lastTime = 0

    const paint = () => {
      if (!current) return
      lens.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
      lens.style.width = `${current.width}px`
      lens.style.height = `${current.height}px`
    }
    const animate = (time: number) => {
      frame = 0
      if (!current || !target) return
      const dt = Math.min((time - lastTime) / 1000 || 1 / 60, 1 / 30)
      lastTime = time
      let settled = true
      for (const key of keys) {
        const step = springStep(current[key], velocity[key], target[key], dt)
        current[key] = step.value
        velocity[key] = step.velocity
        if (
          Math.abs(target[key] - current[key]) > 0.1 ||
          Math.abs(step.velocity) > 0.1
        )
          settled = false
      }
      if (settled) current = { ...target }
      paint()
      if (!settled) frame = requestAnimationFrame(animate)
    }
    const select = (element: HTMLElement | null) => {
      const index = element ? items.indexOf(element) : -1
      target = rects[index] ?? null
      lens.dataset.visible = String(!!target)
      if (!target) return
      if (!current || reduced.matches) {
        current = { ...target }
        velocity = { x: 0, y: 0, width: 0, height: 0 }
        paint()
      } else if (!frame) {
        lastTime = performance.now()
        frame = requestAnimationFrame(animate)
      }
    }
    const resting = () => {
      const focused = items.find((item) =>
        item.contains(document.activeElement),
      )
      return (
        focused ??
        items.find(
          (item) =>
            (item.hasAttribute('aria-current') &&
              item.getAttribute('aria-current') !== 'false') ||
            item.getAttribute('aria-selected') === 'true',
        ) ??
        null
      )
    }
    const measure = () => {
      measurement = 0
      const bounds = root.getBoundingClientRect()
      const scaleX = bounds.width / root.offsetWidth || 1
      const scaleY = bounds.height / root.offsetHeight || 1
      rects = items.map((item) => {
        const rect = item.getBoundingClientRect()
        return {
          x:
            (rect.left - bounds.left) / scaleX -
            root.clientLeft +
            root.scrollLeft,
          y: (rect.top - bounds.top) / scaleY - root.clientTop + root.scrollTop,
          width: rect.width / scaleX,
          height: rect.height / scaleY,
        }
      })
      select(hovered && items.includes(hovered) ? hovered : resting())
    }
    const scheduleMeasure = () => {
      if (!measurement) measurement = requestAnimationFrame(measure)
    }
    const resize = new ResizeObserver(() => register())
    const register = () => {
      const nextItems = Array.from(
        root.querySelectorAll<HTMLElement>(itemSelector),
      ).filter(
        (item) =>
          item.closest('[data-fluid-glass]') === root &&
          !item.matches(':disabled, [aria-disabled="true"], [hidden]') &&
          item.getClientRects().length > 0,
      )
      if (
        nextItems.length !== items.length ||
        nextItems.some((item, index) => item !== items[index])
      ) {
        resize.disconnect()
        resize.observe(root)
        items = nextItems
        items.forEach((item) => resize.observe(item))
      }
      scheduleMeasure()
    }
    const mutations = new MutationObserver(register)
    mutations.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [
        'aria-current',
        'aria-selected',
        'disabled',
        'aria-disabled',
        'hidden',
        'data-fluid-glass-item',
      ],
    })
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const bounds = root.getBoundingClientRect()
      const x =
        (event.clientX - bounds.left) / (bounds.width / root.offsetWidth || 1) -
        root.clientLeft +
        root.scrollLeft
      const y =
        (event.clientY - bounds.top) /
          (bounds.height / root.offsetHeight || 1) -
        root.clientTop +
        root.scrollTop
      hovered = items[nearestRect(rects, x, y)] ?? null
      select(hovered)
      if (target) {
        lens.style.setProperty(
          '--bw-glass-light-x',
          `${Math.max(0, Math.min(100, ((x - target.x) / target.width) * 100))}%`,
        )
      }
    }
    const onPointerLeave = () => {
      hovered = null
      select(resting())
    }
    const onFocus = () => select(resting())
    const onBlur = () =>
      queueMicrotask(() => {
        if (root.isConnected) select(hovered ?? resting())
      })
    const onMotionChange = () => {
      cancelAnimationFrame(frame)
      frame = 0
      current = null
      select(hovered ?? resting())
    }
    root.addEventListener('pointermove', onPointerMove)
    root.addEventListener('pointerleave', onPointerLeave)
    root.addEventListener('pointercancel', onPointerLeave)
    root.addEventListener('focusin', onFocus)
    root.addEventListener('focusout', onBlur)
    window.addEventListener('resize', register)
    reduced.addEventListener('change', onMotionChange)
    resize.observe(root)
    register()
    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(measurement)
      resize.disconnect()
      mutations.disconnect()
      root.removeEventListener('pointermove', onPointerMove)
      root.removeEventListener('pointerleave', onPointerLeave)
      root.removeEventListener('pointercancel', onPointerLeave)
      root.removeEventListener('focusin', onFocus)
      root.removeEventListener('focusout', onBlur)
      window.removeEventListener('resize', register)
      reduced.removeEventListener('change', onMotionChange)
    }
  }, [])

  return (
    <div
      {...props}
      ref={rootRef}
      data-fluid-glass=""
      className={cn(
        'bw-fluid-glass',
        variant === 'subtle' && 'bw-fluid-subtle',
        className,
      )}
    >
      {surface && (
        <GlassSurface
          className="bw-fluid-track"
          refraction={0}
          aria-hidden="true"
        />
      )}
      <div ref={lensRef} className="bw-fluid-lens" aria-hidden="true">
        {variant === 'subtle' ? (
          <span className="bw-fluid-highlight" />
        ) : (
          <GlassSurface
            className="bw-fluid-lens-surface"
            material="clear"
            refraction={28}
            blur={2}
          />
        )}
      </div>
      {children}
    </div>
  )
}
