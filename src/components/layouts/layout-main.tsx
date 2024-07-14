import React from 'react'
import { cn } from '@/utils'

export interface LayoutMainProps {
  className?: string
  children: React.ReactNode
}

export const LayoutMain: React.FC<LayoutMainProps> = ({
  className,
  children,
}) => {
  const cls = cn(
    'flex flex-col grow flex-shrink-0 container box-border px-6 sm:px-8',
    className,
  )

  return <main className={cls}>{children}</main>
}
