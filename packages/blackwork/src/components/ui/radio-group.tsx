'use client'

import { Radio } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import * as React from 'react'

import { Circle } from '@/icons'
import { cn } from '@/utils'

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupPrimitive.Props>(
  ({ className, ...props }, ref) => {
    return (
      <RadioGroupPrimitive
        ref={ref}
        data-slot="radio-group"
        className={cn('grid gap-2', className)}
        {...props}
      />
    )
  },
)
RadioGroup.displayName = 'RadioGroup'

const RadioGroupItem = React.forwardRef<HTMLButtonElement, Radio.Root.Props>(
  ({ className, ...props }, ref) => {
    return (
      <Radio.Root
        ref={ref}
        data-slot="radio-group-item"
        className={cn(
          'aspect-square size-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <Radio.Indicator
          data-slot="radio-group-indicator"
          className="flex items-center justify-center"
        >
          <Circle className="size-2.5 fill-current text-current" />
        </Radio.Indicator>
      </Radio.Root>
    )
  },
)
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
