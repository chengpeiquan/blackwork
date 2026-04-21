import { isArray } from '@bassist/utils'
import React from 'react'
import { cn } from '@/utils'
import { SocialLink, type SocialLinkProps } from './social-link'

export interface SocialLinksProps {
  items: SocialLinkProps[]
  className?: string
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  items,
  className,
}) => {
  const cls = cn('flex shrink-0 items-center gap-1', className)

  if (!isArray(items) || !items.length) return null
  return (
    <div className={cls}>
      {items.map((i) => {
        return <SocialLink key={i.link} {...i} />
      })}
    </div>
  )
}
