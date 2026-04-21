import React from 'react'
import { cn } from '@/utils'
import { layoutCls } from './shared'

export interface LayoutFooterProps {
  className?: string
  children: React.ReactNode
}

export const LayoutFooter: React.FC<LayoutFooterProps> = ({
  className,
  children,
}) => {
  const cls = cn(
    'flex h-32 shrink-0 items-center justify-center text-xs md:text-sm',
    layoutCls.container,
    className,
  )

  return <footer className={cls}>{children}</footer>
}
