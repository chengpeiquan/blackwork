'use client'

import React, {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { cn } from '@/utils'
import { lensPixel } from './fluid-glass-math'
import { GlassDecoration } from './glass-decoration'

export interface GlassMaterialProps {
  /** Clear controls, regular chrome, or a legible floating panel. */
  material?: 'clear' | 'regular' | 'panel'
  refraction?: number
  blur?: number
  className?: string
}

interface LensMap {
  url: string
  width: number
  height: number
}

// The browser engine is stable for the lifetime of the page.
const subscribeToEngine = () => () => {}
const isFrostedEngine = () =>
  !/Chrome|Chromium|Edg\//u.test(navigator.userAgent)
const serverFrostedEngine = () => false

/** Decorative material: place inside a positioned element with a border radius. */
export const GlassMaterial: React.FC<GlassMaterialProps> = ({
  material = 'regular',
  refraction = 56,
  blur = 4,
  className,
}) => {
  const id = `bw-glass-${useId().replace(/:/gu, '')}`
  const ref = useRef<HTMLSpanElement>(null)
  const [map, setMap] = useState<LensMap | null>(null)
  const frosted = useSyncExternalStore(
    subscribeToEngine,
    isFrostedEngine,
    serverFrostedEngine,
  )

  useEffect(() => {
    const element = ref.current
    const owner = element?.parentElement
    if (!element || !owner) return
    let frame = 0
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect()
        element.style.setProperty(
          '--bw-glass-light-x',
          `${((event.clientX - bounds.left) / bounds.width) * 100}%`,
        )
      })
    }
    owner.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      owner.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  useEffect(() => {
    const element = ref.current
    // A stronger frosted material replaces edge refraction on other engines.
    // CSS.supports only checks syntax; it cannot verify SVG backdrop rendering.
    const supportsRefraction = /Chrome|Chromium|Edg\//u.test(
      navigator.userAgent,
    )
    if (!element || !supportsRefraction || refraction === 0) return
    let timer: ReturnType<typeof setTimeout>
    let previousSize = ''
    const observer = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const width = Math.round(element.clientWidth)
        const height = Math.round(element.clientHeight)
        if (!width || !height) return
        const radius = Math.min(
          parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0,
          width / 2,
          height / 2,
        )
        const sizeKey = `${width}:${height}:${radius}`
        if (sizeKey === previousSize) return
        previousSize = sizeKey
        // Keep the real aspect ratio and CSS-pixel curvature on large headers/panels.
        const resolution = Math.min(1, Math.sqrt(240000 / (width * height)))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(width * resolution))
        canvas.height = Math.max(1, Math.round(height * resolution))
        const context = canvas.getContext('2d')
        if (!context) return
        const pixels = context.createImageData(canvas.width, canvas.height)
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const [red, green] = lensPixel(
              ((x + 0.5) / canvas.width) * width,
              ((y + 0.5) / canvas.height) * height,
              width,
              height,
              radius,
            )
            const i = (y * canvas.width + x) * 4
            pixels.data[i] = red
            pixels.data[i + 1] = green
            pixels.data[i + 2] = 128
            pixels.data[i + 3] = 255
          }
        }
        context.putImageData(pixels, 0, 0)
        setMap({ url: canvas.toDataURL(), width, height })
      }, 90)
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [refraction])

  // The host must not create another backdrop root (e.g. its own blur filter).
  // Sample the page once, refract its perimeter, then soften the captured image.
  const effectiveBlur = frosted
    ? Math.max(blur, material === 'panel' ? 20 : 16)
    : blur
  const filter = `${map && refraction !== 0 ? `url(#${id}) ` : ''}blur(${effectiveBlur}px) saturate(1.35)`

  return (
    <GlassDecoration
      ref={ref}
      material={material}
      className={cn(frosted && 'bw-glass-frosted', className)}
      filter={filter}
    >
      {map && refraction !== 0 && (
        <svg
          width={map.width}
          height={map.height}
          focusable="false"
          className="absolute"
        >
          <defs>
            <filter
              id={id}
              x="-35%"
              y="-35%"
              width="170%"
              height="170%"
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={map.url}
                x="0"
                y="0"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                result="lens"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="lens"
                scale={refraction}
                xChannelSelector="R"
                yChannelSelector="G"
                result="red-bend"
              />
              <feColorMatrix
                in="red-bend"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="red"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="lens"
                scale={refraction * 0.96}
                xChannelSelector="R"
                yChannelSelector="G"
                result="green-bend"
              />
              <feColorMatrix
                in="green-bend"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="green"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="lens"
                scale={refraction * 0.92}
                xChannelSelector="R"
                yChannelSelector="G"
                result="blue-bend"
              />
              <feColorMatrix
                in="blue-bend"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="blue"
              />
              <feBlend in="red" in2="green" mode="screen" result="red-green" />
              <feBlend in="red-green" in2="blue" mode="screen" />
            </filter>
          </defs>
        </svg>
      )}
    </GlassDecoration>
  )
}

export interface GlassSurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>, GlassMaterialProps {}

/** Foreground content stays outside the optical layer. */
export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  className,
  material,
  refraction,
  blur,
  ...props
}) => (
  <div {...props} className={cn('bw-glass-surface', className)}>
    <GlassMaterial material={material} refraction={refraction} blur={blur} />
    <div className="bw-glass-content">{children}</div>
  </div>
)
