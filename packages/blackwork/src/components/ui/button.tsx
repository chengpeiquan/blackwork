import { type VariantProps, cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'

import { GlassDecoration } from '@/components/effects/glass-decoration'
import { cn } from '@/utils'
import { Slot } from '@/utils/slot'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        glass: 'bw-glass-control rounded-full text-foreground',
        'glass-primary':
          'bw-glass-control bw-glass-primary rounded-full text-primary-foreground',
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-8 w-8',
      },
      loading: {
        true: 'gap-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  loaderClassName?: string
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loaderClassName,
      loading = false,
      disabled = false,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    const isGlass = variant === 'glass' || variant === 'glass-primary'
    const decorate = (label: React.ReactNode) => (
      <>
        <GlassDecoration material="clear" />
        <span className="bw-glass-control-content">{label}</span>
      </>
    )
    const label = (
      <>
        {loading && !asChild ? (
          <Loader2 className={cn('size-4 animate-spin', loaderClassName)} />
        ) : null}
        {children}
      </>
    )
    // Decorate the slotted link itself, preserving its click/ref/accessibility contract.
    const content =
      isGlass &&
      asChild &&
      React.isValidElement<{ children?: React.ReactNode }>(children)
        ? React.cloneElement(children, {}, decorate(children.props.children))
        : isGlass
          ? decorate(label)
          : asChild
            ? children
            : label

    return (
      <Comp
        data-slot="button"
        data-size={size ?? 'default'}
        className={cn(
          buttonVariants({ variant, size, loading, className }),
          isGlass && size === 'icon' && 'bw-glass-icon',
        )}
        disabled={loading || disabled}
        ref={ref}
        {...props}
      >
        {content}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
