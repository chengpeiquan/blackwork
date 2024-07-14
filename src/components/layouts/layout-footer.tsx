import React from 'react'
import { cn } from '@/utils'

export interface LayoutFooterProps {
  className?: string
  children: React.ReactNode
}

export const LayoutFooter: React.FC<LayoutFooterProps> = ({
  className,
  children,
}) => {
  const cls = cn(
    'flex flex-shrink-0 justify-center items-center container h-32 box-border px-6 sm:px-8 md:text-sm text-xs',
    className,
  )

  return <footer className={cls}>{children}</footer>
}
