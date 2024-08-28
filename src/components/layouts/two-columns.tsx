import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/utils'

export interface TwoColumnBaseProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
}

export const TwoColumnContent: React.FC<TwoColumnBaseProps> = ({
  asChild = false,
  className,
  ...props
}) => {
  const cls = cn('flex flex-col flex-1 overflow-hidden', className)

  const Comp = asChild ? Slot : 'section'

  return <Comp className={cls} {...props} />
}

export const TwoColumnSidebar: React.FC<TwoColumnBaseProps> = ({
  asChild = false,
  className,
  ...props
}) => {
  const cls = cn(
    'flex-shrink-0 flex-col hidden lg:flex lg:w-64 xl:w-80 2xl:96',
    className,
  )

  const Comp = asChild ? Slot : 'aside'

  return <Comp className={cls} {...props} />
}
