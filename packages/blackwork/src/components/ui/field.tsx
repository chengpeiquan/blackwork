'use client'

import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils'

const FieldSet = React.forwardRef<
  HTMLFieldSetElement,
  React.ComponentPropsWithoutRef<'fieldset'>
>(({ className, ...props }, ref) => (
  <fieldset
    ref={ref}
    data-slot="field-set"
    className={cn('flex flex-col gap-4', className)}
    {...props}
  />
))
FieldSet.displayName = 'FieldSet'

const FieldLegend = React.forwardRef<
  HTMLLegendElement,
  React.ComponentPropsWithoutRef<'legend'> & {
    variant?: 'legend' | 'label'
  }
>(({ className, variant = 'legend', ...props }, ref) => (
  <legend
    ref={ref}
    data-slot="field-legend"
    data-variant={variant}
    className={cn(
      'mb-2 font-medium',
      variant === 'legend' ? 'text-base' : 'text-sm',
      className,
    )}
    {...props}
  />
))
FieldLegend.displayName = 'FieldLegend'

const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="field-group"
    className={cn(
      '@container/field-group group/field-group flex w-full flex-col gap-4',
      className,
    )}
    {...props}
  />
))
FieldGroup.displayName = 'FieldGroup'

const fieldVariants = cva('group/field flex w-full gap-2', {
  variants: {
    orientation: {
      vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
      horizontal:
        'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto',
      responsive:
        '@md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:*:data-[slot=field-label]:flex-auto flex-col *:w-full [&>.sr-only]:w-auto',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

const Field = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & VariantProps<typeof fieldVariants>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    data-slot="field"
    data-orientation={orientation}
    className={cn(fieldVariants({ orientation }), className)}
    {...props}
  />
))
Field.displayName = 'Field'

const FieldContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="field-content"
    className={cn('flex flex-1 flex-col gap-1 leading-snug', className)}
    {...props}
  />
))
FieldContent.displayName = 'FieldContent'

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
  <Label
    ref={ref}
    data-slot="field-label"
    className={cn(
      'flex w-fit items-center gap-2 group-data-[disabled=true]/field:opacity-70',
      className,
    )}
    {...props}
  />
))
FieldLabel.displayName = 'FieldLabel'

const FieldTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="field-label"
    className={cn('flex w-fit items-center text-sm font-medium', className)}
    {...props}
  />
))
FieldTitle.displayName = 'FieldTitle'

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<'p'>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="field-description"
    className={cn(
      'text-sm font-normal leading-normal text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:text-primary',
      className,
    )}
    {...props}
  />
))
FieldDescription.displayName = 'FieldDescription'

const FieldSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ children, className, ...props }, ref) => {
  const hasContent = React.Children.count(children) > 0

  return (
    <div
      ref={ref}
      data-slot="field-separator"
      data-content={hasContent ? '' : undefined}
      className={cn('relative py-2', className)}
      {...props}
    >
      <Separator className="absolute inset-x-0 top-1/2" />
      {hasContent ? (
        <span
          data-slot="field-separator-content"
          className="relative mx-auto block w-fit bg-background px-2 text-sm text-muted-foreground"
        >
          {children}
        </span>
      ) : null}
    </div>
  )
})
FieldSeparator.displayName = 'FieldSeparator'

const FieldError = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & {
    errors?: Array<{ message?: string } | undefined>
  }
>(({ className, children, errors, ...props }, ref) => {
  const content = React.useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map((error, index) =>
          error?.message ? <li key={index}>{error.message}</li> : null,
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      ref={ref}
      role="alert"
      data-slot="field-error"
      className={cn('text-sm font-normal text-destructive', className)}
      {...props}
    >
      {content}
    </div>
  )
})
FieldError.displayName = 'FieldError'

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
