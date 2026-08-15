'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import * as React from 'react'
import { Close } from '@/icons'

import { cn } from '@/utils'
import { splitAsChild, type AsChildProps } from '@/utils/as-child'

const Dialog = DialogPrimitive.Root

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogPrimitive.Trigger.Props & AsChildProps
>(({ asChild, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    data-slot="dialog-trigger"
    {...splitAsChild({ asChild, ...props })}
  />
))
DialogTrigger.displayName = 'DialogTrigger'

const DialogPortal = DialogPrimitive.Portal

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  DialogPrimitive.Close.Props & AsChildProps
>(({ asChild, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    data-slot="dialog-close"
    {...splitAsChild({ asChild, ...props })}
  />
))
DialogClose.displayName = 'DialogClose'

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  DialogPrimitive.Backdrop.Props
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Backdrop
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0',
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = 'DialogOverlay'

const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogPrimitive.Popup.Props
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Popup
      ref={ref}
      data-slot="dialog-content"
      className={cn(
        '-translate-1/2 fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 sm:rounded-lg',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="data-open:bg-accent data-open:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <Close className="size-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Popup>
  </DialogPortal>
))
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className,
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  DialogPrimitive.Title.Props
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  DialogPrimitive.Description.Props
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    render={<div />}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
