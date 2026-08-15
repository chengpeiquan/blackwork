import * as React from 'react'

import { cn } from '@/utils'

const AspectRatio = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & {
    ratio?: number
  }
>(({ ratio = 1, className, style, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="aspect-ratio"
    className={cn('relative w-full', className)}
    style={{ aspectRatio: String(ratio), ...style }}
    {...props}
  />
))
AspectRatio.displayName = 'AspectRatio'

export { AspectRatio }
