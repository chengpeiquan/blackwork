'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import * as React from 'react'

import { GlassMaterial } from '@/components/effects/glass-surface'
import { cn } from '@/utils'
import { splitAsChild, type AsChildProps } from '@/utils/as-child'
import { Button } from './button'

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
      'fixed inset-0 z-50 bg-black/80 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0',
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = 'DialogOverlay'

export interface DialogContentProps extends DialogPrimitive.Popup.Props {
  appearance?: 'default' | 'glass'
  closeButtonVisible?: boolean
  closeLabel?: string
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (
    {
      className,
      children,
      appearance = 'default',
      closeButtonVisible = true,
      closeLabel = 'Close',
      ...props
    },
    ref,
  ) => (
    <DialogPortal>
      <DialogOverlay
        className={appearance === 'glass' ? 'bw-glass-overlay' : undefined}
      />
      <DialogPrimitive.Popup
        ref={ref}
        data-slot="dialog-content"
        className={cn(
          '-translate-1/2 fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 sm:rounded-lg',
          appearance === 'glass' && 'bw-glass-dialog',
          className,
        )}
        {...props}
      >
        {appearance === 'glass' ? (
          <>
            <GlassMaterial material="panel" refraction={64} blur={8} />
            <div className="bw-glass-dialog-body">{children}</div>
          </>
        ) : (
          children
        )}
        {closeButtonVisible &&
          (appearance === 'glass' ? (
            <DialogPrimitive.Close
              render={<Button variant="glass" size="icon" />}
              className="bw-glass-dialog-close"
              aria-label={closeLabel}
              title={closeLabel}
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          ) : (
            <DialogPrimitive.Close className="data-open:bg-accent data-open:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="size-4" />
              <span className="sr-only">{closeLabel}</span>
            </DialogPrimitive.Close>
          ))}
      </DialogPrimitive.Popup>
    </DialogPortal>
  ),
)
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
