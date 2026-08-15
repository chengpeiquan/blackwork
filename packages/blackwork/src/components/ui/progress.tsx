'use client'

import { Progress as ProgressPrimitive } from '@base-ui/react/progress'
import * as React from 'react'

import { cn } from '@/utils'

const Progress = React.forwardRef<
  HTMLDivElement,
  Omit<ProgressPrimitive.Root.Props, 'value'> & {
    value?: number | null
  }
>(({ className, value = null, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    data-slot="progress"
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
      className,
    )}
    value={value}
    {...props}
  >
    <ProgressPrimitive.Track className="size-full">
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Track>
  </ProgressPrimitive.Root>
))
Progress.displayName = 'Progress'

export { Progress }
