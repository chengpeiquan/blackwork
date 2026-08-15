'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils'

const buttonGroupVariants = cva(
  'flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 [&>[data-slot=select-trigger]:not([class*="w-"])]:w-fit [&>input]:flex-1',
  {
    variants: {
      orientation: {
        horizontal:
          '*:data-slot:rounded-none [&>[data-slot]:first-child]:rounded-l-md [&>[data-slot]:last-child]:rounded-r-md [&>[data-slot]~[data-slot]]:border-l-0',
        vertical:
          '*:data-slot:rounded-none flex-col [&>[data-slot]:first-child]:rounded-t-md [&>[data-slot]:last-child]:rounded-b-md [&>[data-slot]~[data-slot]]:border-t-0',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
)

const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> &
    VariantProps<typeof buttonGroupVariants>
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    data-slot="button-group"
    data-orientation={orientation}
    className={cn(buttonGroupVariants({ orientation }), className)}
    {...props}
  />
))
ButtonGroup.displayName = 'ButtonGroup'

const ButtonGroupText = ({
  className,
  render,
  ...props
}: useRender.ComponentProps<'div'>) => {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(
          'flex items-center bg-muted px-3 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg]:size-4',
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: 'button-group-text',
    },
  })
}

const ButtonGroupSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Separator>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <Separator
    ref={ref}
    data-slot="button-group-separator"
    orientation={orientation}
    className={cn('relative self-stretch', className)}
    {...props}
  />
))
ButtonGroupSeparator.displayName = 'ButtonGroupSeparator'

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
