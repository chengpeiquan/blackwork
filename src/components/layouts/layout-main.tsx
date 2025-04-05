import { Slot } from '@radix-ui/react-slot'
import React from 'react'
import { cn } from '@/utils'
import { layoutCls } from './shared'

export interface LayoutMainProps {
  fullscreen?: boolean
  className?: string
  children: React.ReactNode
  asChild?: boolean
}

export const LayoutMain: React.FC<LayoutMainProps> = ({
  fullscreen = false,
  className,
  children,
  asChild,
}) => {
  const cls = cn(
    'flex shrink-0 grow flex-col',
    fullscreen ? 'w-screen' : layoutCls.container,
    fullscreen ? '' : layoutCls.main,
    className,
  )

  const Comp = asChild ? Slot : 'main'

  return <Comp className={cls}>{children}</Comp>
}
