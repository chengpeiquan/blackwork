'use client'

import * as React from 'react'
import { cn } from '@/utils'

export interface TopProgressProps {
  /** Keep the component mounted and clear pending on success, failure or cancellation. */
  pending: boolean
  /** Delay in milliseconds before showing feedback for a new task. */
  delay?: number
  /** Accessible name. The visual advance is not a measured percentage. */
  label?: string
  className?: string
}

interface ProgressState {
  phase: 'idle' | 'running' | 'completing' | 'fading'
  value: number
}

const IDLE: ProgressState = { phase: 'idle', value: 0 }

export const TopProgress = ({
  pending,
  delay = 150,
  label = 'Loading',
  className,
}: TopProgressProps) => {
  const [state, setState] = React.useState(IDLE)
  const visible = React.useRef(false)
  const showDelay = Number.isFinite(delay) ? Math.max(0, delay) : 150

  React.useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    let interval: ReturnType<typeof setInterval> | undefined

    if (pending) {
      timers.push(
        setTimeout(
          () => {
            visible.current = true
            setState((previous) => ({
              phase: 'running',
              value:
                previous.value > 0 && previous.value < 1
                  ? previous.value
                  : 0.08,
            }))
            interval = setInterval(() => {
              setState((previous) => ({
                phase: 'running',
                value: Math.min(
                  0.9,
                  previous.value + (0.9 - previous.value) * 0.15,
                ),
              }))
            }, 600)
          },
          visible.current ? 0 : showDelay,
        ),
      )
    } else if (visible.current) {
      timers.push(
        setTimeout(() => setState({ phase: 'completing', value: 1 }), 0),
        setTimeout(() => setState({ phase: 'fading', value: 1 }), 200),
        setTimeout(() => {
          visible.current = false
          setState(IDLE)
        }, 400),
      )
    }

    // A new task cancels the old completion timers, including during fade-out.
    return () => {
      timers.forEach(clearTimeout)
      clearInterval(interval)
    }
  }, [pending, showDelay])

  if (state.phase === 'idle') return null

  return (
    <div
      data-slot="top-progress"
      data-state={state.phase}
      role={pending ? 'progressbar' : undefined}
      aria-label={pending ? label : undefined}
      aria-hidden={pending ? undefined : true}
      className={cn(
        'bw-top-progress pointer-events-none fixed inset-x-0 top-0 z-100 h-0.5',
        className,
      )}
    >
      <div
        data-slot="top-progress-indicator"
        className="bw-top-progress-indicator size-full origin-left bg-primary"
        style={{ transform: `scaleX(${state.value})` }}
      />
    </div>
  )
}
