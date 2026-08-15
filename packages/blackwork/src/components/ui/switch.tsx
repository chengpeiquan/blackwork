'use client'

import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import * as React from 'react'

import { cn } from '@/utils'

const Switch = React.forwardRef<HTMLButtonElement, SwitchPrimitive.Root.Props>(
  ({ className, ...props }, ref) => (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      className={cn(
        'data-checked:bg-primary data-unchecked:bg-input peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[checked]:translate-x-5 data-[unchecked]:translate-x-0"
      />
    </SwitchPrimitive.Root>
  ),
)
Switch.displayName = 'Switch'

export { Switch }
