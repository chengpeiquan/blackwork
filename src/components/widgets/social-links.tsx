import React from 'react'
import { isArray } from '@bassist/utils'
import { SocialLink, type SocialLinkProps } from './social-link'

export interface SocialLinksProps {
  items: SocialLinkProps[]
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ items }) => {
  if (!isArray(items) || !items.length) return null
  return (
    <div className="flex flex-shrink-0 items-center gap-1">
      {items.map((i) => {
        return <SocialLink key={i.link} {...i} />
      })}
    </div>
  )
}
