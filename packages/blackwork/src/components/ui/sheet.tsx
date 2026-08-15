'use client'

import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { Close } from '@/icons'
import { cn } from '@/utils'
import { splitAsChild, type AsChildProps } from '@/utils/as-child'

const Sheet = SheetPrimitive.Root

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  SheetPrimitive.Trigger.Props & AsChildProps
>(({ asChild, ...props }, ref) => (
  <SheetPrimitive.Trigger
    ref={ref}
    data-slot="sheet-trigger"
    {...splitAsChild({ asChild, ...props })}
  />
))
SheetTrigger.displayName = 'SheetTrigger'

const SheetClose = React.forwardRef<
  HTMLButtonElement,
  SheetPrimitive.Close.Props & AsChildProps
>(({ asChild, ...props }, ref) => (
  <SheetPrimitive.Close
    ref={ref}
    data-slot="sheet-close"
    {...splitAsChild({ asChild, ...props })}
  />
))
SheetClose.displayName = 'SheetClose'

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  HTMLDivElement,
  SheetPrimitive.Backdrop.Props
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Backdrop
    ref={ref}
    data-slot="sheet-overlay"
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0',
      className,
    )}
    {...props}
  />
))
SheetOverlay.displayName = 'SheetOverlay'

const sheetVariants = cva(
  'data-closed:duration-300 data-open:duration-500 fixed z-50 gap-4 border-border bg-background p-6 shadow-lg transition ease-in-out data-[open]:animate-in data-[closed]:animate-out',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[closed]:slide-out-to-top data-[open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[closed]:slide-out-to-bottom data-[open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[closed]:slide-out-to-left data-[open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l data-[closed]:slide-out-to-right data-[open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
)

interface SheetContentProps
  extends SheetPrimitive.Popup.Props, VariantProps<typeof sheetVariants> {
  closeButtonVisible?: boolean
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  (
    {
      side = 'right',
      className,
      children,
      closeButtonVisible = true,
      ...props
    },
    ref,
  ) => {
    return (
      <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Popup
          ref={ref}
          data-slot="sheet-content"
          data-side={side}
          className={cn(sheetVariants({ side }), className)}
          {...props}
        >
          {children}

          {closeButtonVisible ? (
            <SheetPrimitive.Close className="data-open:bg-secondary absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <Close className="size-4" />
              <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
          ) : null}
        </SheetPrimitive.Popup>
      </SheetPortal>
    )
  },
)
SheetContent.displayName = 'SheetContent'

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className,
    )}
    {...props}
  />
)
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = ({
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
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  SheetPrimitive.Title.Props
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    data-slot="sheet-title"
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
))
SheetTitle.displayName = 'SheetTitle'

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  SheetPrimitive.Description.Props
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    data-slot="sheet-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
SheetDescription.displayName = 'SheetDescription'

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
