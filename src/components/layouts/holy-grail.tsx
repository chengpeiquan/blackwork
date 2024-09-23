import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/utils'

export interface HolyGrailBaseProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
}

export const HolyGrailContent: React.FC<HolyGrailBaseProps> = ({
  asChild = false,
  className,
  ...props
}) => {
  const cls = cn('flex flex-col flex-1 overflow-hidden', className)

  const Comp = asChild ? Slot : 'section'

  return <Comp className={cls} {...props} />
}

export interface HolyGrailAsideProps extends HolyGrailBaseProps {
  smaller?: boolean
}

export const HolyGrailAside: React.FC<HolyGrailAsideProps> = ({
  asChild = false,
  smaller = false,
  className,
  ...props
}) => {
  const cls = cn('flex-shrink-0 flex-col gap-12 hidden', className, {
    'lg:flex lg:w-32 xl:w-48 2xl:w-64': smaller,
    'lg:flex lg:w-64 xl:w-80 2xl:w-96': !smaller,
  })

  const Comp = asChild ? Slot : 'aside'

  return <Comp className={cls} {...props} />
}