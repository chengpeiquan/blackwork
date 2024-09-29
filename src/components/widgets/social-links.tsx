import React from 'react'
import { isArray } from '@bassist/utils'
import { SocialLink, type SocialLinkProps } from './social-link'
import { cn } from '@/utils'

export interface SocialLinksProps {
  items: SocialLinkProps[]
  className?: string
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  items,
  className,
}) => {
  const cls = cn('flex flex-shrink-0 items-center gap-1', className)

  if (!isArray(items) || !items.length) return null
  return (
    <div className={cls}>
      {items.map((i) => {
        return <SocialLink key={i.link} {...i} />
      })}
    </div>
  )
}
