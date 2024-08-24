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
    'flex flex-shrink-0 justify-center items-center h-32 md:text-sm text-xs',
    layoutCls.container,
    className,
  )

  return <footer className={cls}>{children}</footer>
}
