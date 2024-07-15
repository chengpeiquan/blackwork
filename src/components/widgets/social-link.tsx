import React from 'react'
import { Button } from '@/components/ui'
import { ExternalLink } from './external-link'
import * as Icons from './icons'

export type SocialLinkIconType =
  | 'github'
  | 'x'
  | 'twitter'
  | 'instagram'
  | 'zhihu'
  | 'rss'

export interface SocialLinkProps {
  type: SocialLinkIconType
  link: string
  ariaLabel?: string
}

export const SocialLink: React.FC<SocialLinkProps> = ({
  type,
  link,
  ariaLabel,
}) => {
  const { SocialIcon, label } = useMemo(() => {
    switch (type) {
      case 'github': {
        return {
          SocialIcon: Icons.Github,
          label: ariaLabel ?? 'GitHub',
        }
      }

      case 'x': {
        return {
          SocialIcon: Icons.X,
          label: ariaLabel ?? 'X',
        }
      }

      case 'twitter': {
        return {
          SocialIcon: Icons.Twitter,
          label: ariaLabel ?? 'Twitter',
        }
      }

      case 'instagram': {
        return {
          SocialIcon: Icons.Instagram,
          label: ariaLabel ?? 'Instagram',
        }
      }

      case 'zhihu': {
        return {
          SocialIcon: Icons.ZhiHu,
          label: ariaLabel ?? 'ZhiHu',
        }
      }

      case 'rss': {
        return {
          SocialIcon: Icons.Rss,
          label: ariaLabel ?? 'RSS',
        }
      }

      default: {
        return {
          SocialIcon: null,
          label: '',
        }
      }
    }
  }, [ariaLabel, type])

  if (!SocialIcon) return null
  return (
    <Button variant="ghost" size="icon" title={label} aria-label={label}>
      <ExternalLink
        className="flex items-center justify-center w-full h-full"
        href={link}
      >
        <SocialIcon className="h-5 w-5" />
      </ExternalLink>
    </Button>
  )
}
