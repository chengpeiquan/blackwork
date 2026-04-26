'use client'

import { Button, cn } from 'blackwork'
import { ChevronsLeft, Toc } from 'blackwork/icons'
import React, {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import {
  buildTocTrackGeometry,
  getTocGuideOffset,
  getTocItemPadding,
  type DocsTocTrackGeometry,
  type DocsTocTrackPosition,
} from './docs-toc-geometry'

export interface DocsTocHeading {
  depth: number
  id: string
  title: string
}

export interface DefaultDocsTocProps {
  className?: string
  collapseEnabled?: boolean
  defaultCollapsed?: boolean
  dock?: 'fixed' | 'sticky'
  headings: DocsTocHeading[]
  minHeadings?: number
}

interface HeadingState {
  active: boolean
  fallback: boolean
  id: string
  t: number
}

interface TrackMeasurement extends DocsTocTrackGeometry {
  itemLineLengths: Array<[number, number]>
}

interface TrackRangeState {
  endIdx: number
  isUp: boolean
  startIdx: number
}

interface TrackState {
  bottom: number
  offsetDistance: number
  top: number
}

const getTocLinkClassName = () =>
  [
    'relative block py-1.5 pr-3 text-sm text-muted-foreground transition-colors',
    'hover:text-foreground data-[active=true]:text-primary',
  ].join(' ')

const getTrackContainerStyle = (
  measurement: TrackMeasurement | null,
  scrollTop: number,
): CSSProperties => ({
  height: `${measurement?.height ?? 1}px`,
  transform: `translateY(${-scrollTop}px)`,
  width: `${measurement?.width ?? 1}px`,
})

const getTrackPathStyle = (track: TrackState | null): CSSProperties => {
  const top = track?.top ?? 0
  const bottom = track?.bottom ?? 0

  return {
    clipPath: `polygon(0 ${top}px, 100% ${top}px, 100% ${bottom}px, 0 ${bottom}px)`,
    opacity: track ? 1 : 0,
  }
}

const getTrackThumbStyle = (
  measurement: TrackMeasurement | null,
  track: TrackState | null,
): CSSProperties => ({
  offsetDistance: `${track?.offsetDistance ?? 0}px`,
  offsetPath: `path("${measurement?.path || 'M0 0 L0 0'}")`,
  opacity: track ? 1 : 0,
})

const getActiveIds = (items: HeadingState[]) =>
  items
    .filter((item) => item.active)
    .sort((left, right) => left.t - right.t)
    .map((item) => item.id)

const getNearestHeadingId = (items: HeadingState[], viewTop: number) => {
  let closestId: string | null = null
  let closestDistance = Number.POSITIVE_INFINITY

  for (const item of items) {
    const element = document.getElementById(item.id)
    if (!element) continue

    const distance = Math.abs(element.getBoundingClientRect().top - viewTop)
    if (distance < closestDistance) {
      closestDistance = distance
      closestId = item.id
    }
  }

  return closestId
}

const getNumberStyleValue = (value: string) => {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const measureTrackMetrics = (
  list: HTMLOListElement,
  headings: DocsTocHeading[],
) => {
  const items = new Map(
    Array.from(
      list.querySelectorAll<HTMLAnchorElement>('a[data-heading-id]'),
    ).map((link) => [link.dataset.headingId ?? '', link]),
  )

  return headings.flatMap((heading) => {
    const link = items.get(heading.id)
    if (!link) return []

    const styles = getComputedStyle(link)
    return [
      {
        bottom:
          link.offsetTop +
          link.clientHeight -
          getNumberStyleValue(styles.paddingBottom),
        depth: heading.depth,
        id: heading.id,
        top: link.offsetTop + getNumberStyleValue(styles.paddingTop),
      },
    ]
  })
}

const measureItemLineLengths = (
  positions: DocsTocTrackPosition[],
  path: string,
) => {
  if (path.length === 0 || positions.length === 0) {
    return []
  }

  try {
    const pathElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    )
    pathElement.setAttribute('d', path)

    const itemLineLengths: Array<[number, number]> = []
    const totalLength = pathElement.getTotalLength()

    positions.forEach((position, index) => {
      let length =
        index > 0
          ? itemLineLengths[index - 1][1] +
            (position.top - positions[index - 1].bottom)
          : position.top

      while (
        length < totalLength &&
        pathElement.getPointAtLength(length).y < position.top
      ) {
        length += 1
      }

      itemLineLengths.push([length, length + (position.bottom - position.top)])
    })

    return itemLineLengths
  } catch {
    return positions.map(
      (position) => [position.top, position.bottom] as [number, number],
    )
  }
}

const sameTrackMeasurement = (
  left: TrackMeasurement | null,
  right: TrackMeasurement | null,
) => {
  if (!left || !right) {
    return left === right
  }

  if (
    left.height !== right.height ||
    left.path !== right.path ||
    left.width !== right.width ||
    left.positions.length !== right.positions.length ||
    left.itemLineLengths.length !== right.itemLineLengths.length
  ) {
    return false
  }

  for (let index = 0; index < left.positions.length; index += 1) {
    const leftPosition = left.positions[index]
    const rightPosition = right.positions[index]

    if (
      leftPosition.bottom !== rightPosition.bottom ||
      leftPosition.depth !== rightPosition.depth ||
      leftPosition.id !== rightPosition.id ||
      leftPosition.top !== rightPosition.top ||
      leftPosition.x !== rightPosition.x
    ) {
      return false
    }
  }

  for (let index = 0; index < left.itemLineLengths.length; index += 1) {
    const leftLine = left.itemLineLengths[index]
    const rightLine = right.itemLineLengths[index]

    if (leftLine[0] !== rightLine[0] || leftLine[1] !== rightLine[1]) {
      return false
    }
  }

  return true
}

const sameTrackState = (left: TrackState | null, right: TrackState | null) => {
  if (!left || !right) {
    return left === right
  }

  return (
    left.bottom === right.bottom &&
    left.offsetDistance === right.offsetDistance &&
    left.top === right.top
  )
}

const getTrackState = (
  activeIds: string[],
  measurement: TrackMeasurement,
  previous: TrackRangeState | null,
): [TrackState | null, TrackRangeState | null] => {
  const activeSet = new Set(activeIds)
  const startIdx = measurement.positions.findIndex((position) =>
    activeSet.has(position.id),
  )

  if (startIdx === -1) {
    return [null, null]
  }

  let endIdx = startIdx
  measurement.positions.forEach((position, index) => {
    if (activeSet.has(position.id)) {
      endIdx = index
    }
  })

  const isUp = previous
    ? previous.startIdx > startIdx ||
      previous.endIdx > endIdx ||
      (previous.startIdx === startIdx &&
        previous.endIdx === endIdx &&
        previous.isUp)
    : false

  const startLength =
    measurement.itemLineLengths[startIdx]?.[0] ??
    measurement.positions[startIdx].top
  const endLength =
    measurement.itemLineLengths[endIdx]?.[1] ??
    measurement.positions[endIdx].bottom

  return [
    {
      bottom: measurement.positions[endIdx].bottom,
      offsetDistance: isUp ? startLength : endLength,
      top: measurement.positions[startIdx].top,
    },
    {
      endIdx,
      isUp,
      startIdx,
    },
  ]
}

function useActiveHeadingIds(headings: DocsTocHeading[]) {
  const [activeIds, setActiveIds] = useState<string[]>([])

  useEffect(() => {
    if (
      headings.length === 0 ||
      typeof document === 'undefined' ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return
    }

    const states = new Map<string, HeadingState>(
      headings.map((heading) => [
        heading.id,
        {
          active: false,
          fallback: false,
          id: heading.id,
          t: 0,
        },
      ]),
    )

    const emit = (viewTop = 0) => {
      for (const item of states.values()) {
        if (item.fallback) {
          item.active = false
          item.fallback = false
        }
      }

      let active = getActiveIds([...states.values()])

      if (active.length === 0) {
        const nearestId = getNearestHeadingId([...states.values()], viewTop)
        const nearest = nearestId ? states.get(nearestId) : undefined

        if (nearest) {
          nearest.active = true
          nearest.fallback = true
          nearest.t = Date.now()
          active = [nearest.id]
        }
      }

      setActiveIds(active)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now()

        for (const entry of entries) {
          const item = states.get(entry.target.id)
          if (!item) continue

          if (item.active !== entry.isIntersecting || item.fallback) {
            item.active = entry.isIntersecting
            item.fallback = false
            item.t = now
          }
        }

        emit(entries[0]?.rootBounds?.top ?? 0)
      },
      {
        threshold: 0.9,
      },
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    emit()

    return () => {
      observer.disconnect()
    }
  }, [headings])

  return activeIds
}

function useTocTrack(activeIds: string[], headings: DocsTocHeading[]) {
  const listRef = useRef<HTMLOListElement>(null)
  const [measurement, setMeasurement] = useState<TrackMeasurement | null>(null)
  const [track, setTrack] = useState<TrackState | null>(null)
  const previousRangeRef = useRef<TrackRangeState | null>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    let frame = 0

    const update = () => {
      cancelAnimationFrame(frame)

      frame = requestAnimationFrame(() => {
        const metrics = measureTrackMetrics(list, headings)
        const geometry = buildTocTrackGeometry(metrics)
        const nextMeasurement = {
          ...geometry,
          itemLineLengths: measureItemLineLengths(
            geometry.positions,
            geometry.path,
          ),
        }

        setMeasurement((current) =>
          sameTrackMeasurement(current, nextMeasurement)
            ? current
            : nextMeasurement,
        )
      })
    }

    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(list)
    window.addEventListener('resize', update)
    update()

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [headings])

  useEffect(() => {
    let frame = 0

    frame = requestAnimationFrame(() => {
      if (!measurement || activeIds.length === 0) {
        previousRangeRef.current = null
        setTrack((current) => (current === null ? current : null))
        return
      }

      const [nextTrack, nextRange] = getTrackState(
        activeIds,
        measurement,
        previousRangeRef.current,
      )

      previousRangeRef.current = nextRange
      setTrack((current) =>
        sameTrackState(current, nextTrack) ? current : nextTrack,
      )
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [activeIds, measurement])

  return [listRef, measurement, track] as const
}

export const DefaultDocsToc: React.FC<DefaultDocsTocProps> = ({
  className,
  collapseEnabled = false,
  defaultCollapsed = false,
  dock = 'sticky',
  headings,
  minHeadings = 1,
}) => {
  const activeIds = useActiveHeadingIds(headings)
  const [listRef, measurement, track] = useTocTrack(activeIds, headings)
  const activeIdSet = useMemo(() => new Set(activeIds), [activeIds])
  const listId = useId()
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [scrollTop, setScrollTop] = useState(0)

  if (headings.length < minHeadings) {
    return null
  }

  return (
    <aside
      data-docs-region="toc"
      data-docs-toc-collapsible={collapseEnabled ? 'true' : undefined}
      data-docs-toc-collapsed={collapseEnabled ? String(collapsed) : undefined}
      className={cn(
        'hidden w-64 xl:block',
        dock === 'sticky'
          ? 'shrink-0 xl:self-start xl:sticky xl:top-24'
          : 'xl:fixed xl:top-24',
        className,
      )}
    >
      <nav aria-label="On This Page" className="flex flex-col gap-3 text-sm">
        {!collapsed ? (
          <div
            className={cn(
              'flex items-center gap-2',
              collapseEnabled ? 'justify-between' : undefined,
            )}
          >
            <p className="font-medium text-foreground">On This Page</p>

            {collapseEnabled ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                data-docs-toc-toggle="true"
                aria-controls={listId}
                aria-expanded="true"
                title="Collapse outline"
                aria-label="Collapse outline"
                className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setCollapsed((current) => !current)
                }}
              >
                <ChevronsLeft className="size-4" aria-hidden="true" />
                <span className="sr-only">Collapse outline</span>
              </Button>
            ) : null}
          </div>
        ) : null}

        {!collapsed ? (
          <div className="relative">
            <div
              aria-hidden="true"
              data-docs-toc-track="true"
              className="pointer-events-none absolute left-0 top-0 transition-transform duration-150 ease-out"
              style={getTrackContainerStyle(measurement, scrollTop)}
            >
              <svg
                data-docs-toc-track-path="true"
                height={measurement?.height ?? 1}
                viewBox={`0 0 ${measurement?.width ?? 1} ${measurement?.height ?? 1}`}
                width={measurement?.width ?? 1}
                className="absolute left-0 top-0 transition-[clip-path,opacity] duration-150 ease-out"
                style={getTrackPathStyle(track)}
              >
                <path
                  d={measurement?.path || 'M0 0 L0 0'}
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  className="text-primary"
                />
              </svg>
              <span
                data-docs-toc-thumb="true"
                className="absolute left-0 top-0 size-1 rounded-full bg-primary transition-[opacity,offset-distance] duration-150 ease-out"
                style={getTrackThumbStyle(measurement, track)}
              />
            </div>

            <ol
              id={listId}
              ref={listRef}
              className="flex max-h-[calc(100dvh-8rem)] flex-col overflow-auto py-1 [scrollbar-width:none]"
              onScroll={(event) => {
                setScrollTop(event.currentTarget.scrollTop)
              }}
            >
              {headings.map((heading, index) => {
                const active = activeIdSet.has(heading.id)
                const offset = getTocGuideOffset(heading.depth)
                const upperOffset =
                  index > 0
                    ? getTocGuideOffset(headings[index - 1].depth)
                    : offset
                const lowerOffset =
                  index + 1 < headings.length
                    ? getTocGuideOffset(headings[index + 1].depth)
                    : offset

                return (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      data-active={active ? 'true' : 'false'}
                      data-depth={heading.depth}
                      data-heading-id={heading.id}
                      className={getTocLinkClassName()}
                      style={{
                        paddingInlineStart: `${getTocItemPadding(heading.depth)}px`,
                      }}
                    >
                      {offset !== upperOffset ? (
                        <svg
                          aria-hidden="true"
                          data-docs-toc-item-curve="true"
                          viewBox={`${Math.min(offset, upperOffset)} 0 ${Math.abs(
                            upperOffset - offset,
                          )} 12`}
                          className="pointer-events-none absolute"
                          style={{
                            height: '12px',
                            insetInlineStart: `${Math.min(offset, upperOffset)}px`,
                            top: '-6px',
                            width: `${Math.abs(upperOffset - offset) + 1}px`,
                            zIndex: -1,
                          }}
                        >
                          <path
                            d={`M ${upperOffset} 0 C ${upperOffset} 8 ${offset} 4 ${offset} 12`}
                            stroke="currentColor"
                            strokeWidth="1"
                            fill="none"
                            className="text-border"
                          />
                        </svg>
                      ) : null}
                      <span
                        aria-hidden="true"
                        data-docs-toc-item-line="true"
                        className="pointer-events-none absolute w-px bg-border"
                        style={{
                          bottom: offset !== lowerOffset ? '6px' : '0px',
                          insetInlineStart: `${offset}px`,
                          top: offset !== upperOffset ? '6px' : '0px',
                          zIndex: -1,
                        }}
                      />
                      {heading.title}
                    </a>
                  </li>
                )
              })}
            </ol>
          </div>
        ) : (
          <Button
            type="button"
            data-docs-toc-panel="collapsed"
            variant="ghost"
            size="icon"
            aria-label="Expand outline"
            aria-expanded="false"
            title="Expand outline"
            className="self-start shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setCollapsed(false)
            }}
          >
            <Toc className="size-4" aria-hidden="true" />
            <span className="sr-only">Expand outline</span>
          </Button>
        )}
      </nav>
    </aside>
  )
}
