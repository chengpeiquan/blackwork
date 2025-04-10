import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { type ButtonProps, buttonVariants } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MoreHorizontal } from '@/icons'
import { cn } from '@/utils'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

const paginationLinkVariants = cva('', {
  variants: {
    disabled: {
      true: 'pointer-events-none opacity-50 cursor-not-allowed',
      false: '',
    },
  },
  defaultVariants: {
    disabled: false,
  },
})

type PaginationLinkProps<T extends React.ElementType> = {
  isActive?: boolean
  as?: T
} & Pick<ButtonProps, 'size'> &
  React.ComponentPropsWithoutRef<T> &
  VariantProps<typeof paginationLinkVariants>

const PaginationLink = <T extends React.ElementType = 'a'>({
  className,
  isActive,
  disabled,
  size = 'icon',
  as,
  ...props
}: PaginationLinkProps<T>) => {
  const Component = as || 'a'

  return (
    <Component
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        paginationLinkVariants({ disabled }),
        className,
      )}
      {...props}
    />
  )
}
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = (
  props: React.ComponentProps<typeof PaginationLink>,
) => (
  <PaginationLink {...props}>
    <ChevronLeft className="size-4" />
    <span className="sr-only">Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = (props: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink {...props}>
    <span className="sr-only">Next</span>
    <ChevronRight className="size-4" />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof paginationLinkVariants>) => (
  <span
    aria-hidden
    className={cn(
      'flex size-9 items-center justify-center',
      paginationLinkVariants({ disabled }),
      className,
    )}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
