import React from 'react'
import { cn } from '@/utils'

export interface GlassDecorationProps extends React.PropsWithChildren {
  material?: 'clear' | 'regular' | 'panel'
  className?: string
  filter?: string
  ref?: React.Ref<HTMLSpanElement>
}

/** The static material also works in server-rendered controls. */
export const GlassDecoration: React.FC<GlassDecorationProps> = ({
  children,
  material = 'regular',
  className,
  filter = 'blur(2px) saturate(1.35)',
  ref,
}) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn('bw-glass-material', className)}
    data-material={material}
  >
    {children}
    <span
      className="bw-glass-optics"
      style={{
        backdropFilter: filter,
        WebkitBackdropFilter: filter,
      }}
    />
    <span className="bw-glass-rim" />
  </span>
)
