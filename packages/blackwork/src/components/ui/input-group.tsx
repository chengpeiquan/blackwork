'use client'

import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils'

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    data-slot="input-group"
    className={cn(
      'group/input-group relative flex h-10 w-full min-w-0 items-center rounded-md border border-input bg-background shadow-sm has-[>textarea]:h-auto has-[>[data-slot=input-group-control]:focus-visible]:ring-2 has-[>[data-slot=input-group-control]:focus-visible]:ring-ring has-[>[data-slot=input-group-control]:focus-visible]:ring-offset-2 has-[>[data-slot=input-group-control]:focus-visible]:ring-offset-background',
      className,
    )}
    {...props}
  />
))
InputGroup.displayName = 'InputGroup'

const inputGroupAddonVariants = cva(
  'flex h-full cursor-text select-none items-center justify-center gap-2 px-3 text-sm text-muted-foreground [&>svg]:size-4',
  {
    variants: {
      align: {
        'inline-start': 'order-first',
        'inline-end': 'order-last',
        'block-start': 'order-first w-full justify-start pt-2',
        'block-end': 'order-last w-full justify-start pb-2',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
)

const focusInputGroupControl = (
  event: React.SyntheticEvent<HTMLDivElement>,
) => {
  if ((event.target as HTMLElement).closest('button')) {
    return
  }

  event.currentTarget.parentElement
    ?.querySelector<HTMLElement>('input, textarea')
    ?.focus()
}

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> &
    VariantProps<typeof inputGroupAddonVariants>
>(({ className, align = 'inline-start', ...props }, ref) => (
  // Mouse convenience only. Keyboard users tab directly to the control.
  // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
  <div
    ref={ref}
    role="group"
    data-slot="input-group-addon"
    data-align={align}
    className={cn(inputGroupAddonVariants({ align }), className)}
    onClick={focusInputGroupControl}
    {...props}
  />
))
InputGroupAddon.displayName = 'InputGroupAddon'

const inputGroupButtonVariants = cva('shadow-none', {
  variants: {
    size: {
      xs: 'h-7 rounded-sm px-2 text-xs',
      sm: 'h-8 px-2.5 text-xs',
      'icon-xs': 'size-7 p-0',
      'icon-sm': 'size-8 p-0',
    },
  },
  defaultVariants: {
    size: 'xs',
  },
})

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentProps<typeof Button>, 'size'> &
    VariantProps<typeof inputGroupButtonVariants>
>(
  (
    { className, type = 'button', variant = 'ghost', size = 'xs', ...props },
    ref,
  ) => (
    <Button
      ref={ref}
      type={type}
      variant={variant}
      size={size === 'icon-xs' || size === 'icon-sm' ? 'icon' : 'sm'}
      data-size={size}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  ),
)
InputGroupButton.displayName = 'InputGroupButton'

const InputGroupText = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg]:size-4',
      className,
    )}
    {...props}
  />
))
InputGroupText.displayName = 'InputGroupText'

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => (
  <Input
    ref={ref}
    data-slot="input-group-control"
    className={cn(
      'flex-1 border-0 bg-transparent shadow-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0',
      className,
    )}
    {...props}
  />
))
InputGroupInput.displayName = 'InputGroupInput'

const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<typeof Textarea>
>(({ className, ...props }, ref) => (
  <Textarea
    ref={ref}
    data-slot="input-group-control"
    className={cn(
      'flex-1 resize-none border-0 bg-transparent shadow-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0',
      className,
    )}
    {...props}
  />
))
InputGroupTextarea.displayName = 'InputGroupTextarea'

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
