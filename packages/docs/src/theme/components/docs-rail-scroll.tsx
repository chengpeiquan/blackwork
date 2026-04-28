'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { getDocsRailFadeState } from './docs-rail-scroll-state'

export interface DocsRailScrollProps {
  children: ReactNode
}

const initialFadeState = {
  bottomVisible: false,
  topVisible: false,
}

const getFadeClassName = (visible: boolean) =>
  visible ? 'opacity-100' : 'opacity-0'

export const DocsRailScroll = ({ children }: DocsRailScrollProps) => {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [fadeState, setFadeState] = useState(initialFadeState)

  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) return

    const updateFadeState = () => {
      const nextState = getDocsRailFadeState({
        scrollTop: viewport.scrollTop,
        clientHeight: viewport.clientHeight,
        scrollHeight: viewport.scrollHeight,
      })

      setFadeState((currentState) => {
        if (
          currentState.bottomVisible === nextState.bottomVisible &&
          currentState.topVisible === nextState.topVisible
        ) {
          return currentState
        }

        return nextState
      })
    }

    updateFadeState()

    viewport.addEventListener('scroll', updateFadeState, { passive: true })

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            updateFadeState()
          })

    resizeObserver?.observe(viewport)

    const content = viewport.firstElementChild

    if (content instanceof HTMLElement) {
      resizeObserver?.observe(content)
    }

    return () => {
      viewport.removeEventListener('scroll', updateFadeState)
      resizeObserver?.disconnect()
    }
  }, [])

  return (
    <div
      data-docs-sidebar-scroll="true"
      className="relative lg:max-h-[calc(100dvh-6rem)] lg:overflow-hidden"
    >
      <div
        aria-hidden="true"
        data-docs-sidebar-fade="top"
        className={[
          'pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-8 bg-gradient-to-b from-background via-background/80 to-transparent transition-opacity lg:block',
          getFadeClassName(fadeState.topVisible),
        ].join(' ')}
      />

      <div
        ref={viewportRef}
        data-docs-rail-viewport="true"
        className="lg:max-h-[calc(100dvh-6rem)] lg:overflow-auto lg:pb-8 lg:pr-4 [scrollbar-width:none]"
      >
        {children}
      </div>

      <div
        aria-hidden="true"
        data-docs-sidebar-fade="bottom"
        className={[
          'pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-12 bg-gradient-to-t from-background via-background/80 to-transparent transition-opacity lg:block',
          getFadeClassName(fadeState.bottomVisible),
        ].join(' ')}
      />
    </div>
  )
}
