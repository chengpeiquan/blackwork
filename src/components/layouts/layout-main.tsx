import React from 'react'
import { cn } from '@/utils'

export interface LayoutMainProps {
  fullscreen?: boolean
  className?: string
  children: React.ReactNode
}

export const LayoutMain: React.FC<LayoutMainProps> = ({
  fullscreen = false,
  className,
  children,
}) => {
  const cls = cn(
    'flex flex-col grow flex-shrink-0 box-border',
    fullscreen ? 'w-screen' : 'container px-6 sm:px-8',
    className,
  )

  return <main className={cls}>{children}</main>
}
