'use client'

import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/utils'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<'label'> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  // Consumers associate this primitive via `htmlFor` or nested controls.
  // oxlint-disable-next-line eslint-plugin-jsx-a11y/label-has-associated-control
  <label
    ref={ref}
    data-slot="label"
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = 'Label'

export { Label }
