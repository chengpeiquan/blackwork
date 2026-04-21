import { cva } from 'class-variance-authority'
import React from 'react'
import { cn } from '@/utils'

export interface TypographyBaseProps {
  className?: string
  children: React.ReactNode
}

const headingVariants = cva('scroll-m-20 tracking-tight', {
  variants: {
    level: {
      1: 'text-4xl font-extrabold',
      2: 'border-b pb-2 text-3xl font-semibold first:mt-0',
      3: 'text-2xl font-semibold',
      4: 'text-xl font-semibold',
    },
  },
})

const headingLevels = [1, 2, 3, 4] as const

export interface TypographyTitleProps extends TypographyBaseProps {
  level?: (typeof headingLevels)[number]
}

export const Heading: React.FC<TypographyTitleProps> = ({
  level = 1,
  className,
  children,
}) => {
  const cls = cn(headingVariants({ level }), className)

  const Comp = headingLevels.includes(level) ? `h${level}` : 'h1'

  return React.createElement(Comp, { className: cls }, children)
}

export const Paragraph: React.FC<TypographyBaseProps> = ({
  className,
  children,
}) => {
  const cls = cn('leading-7 [&:not(:first-child)]:mt-6', className)

  return <p className={cls}>{children}</p>
}
