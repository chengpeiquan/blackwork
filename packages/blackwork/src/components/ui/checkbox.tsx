'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import * as React from 'react'

import { Check } from '@/icons'
import { cn } from '@/utils'

const Checkbox = React.forwardRef<
  HTMLButtonElement,
  CheckboxPrimitive.Root.Props
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn(
      'data-checked:bg-primary data-checked:text-primary-foreground peer size-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className="flex items-center justify-center text-current"
    >
      <Check className="size-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = 'Checkbox'

export { Checkbox }
