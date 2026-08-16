import { Rss } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui'
import { ExternalLink } from './external-link'
import {
  GithubIcon,
  InstagramIcon,
  TwitterIcon,
  XIcon,
  ZhihuIcon,
} from './social-icons'

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
  label?: string
  ariaLabel?: string
}

export const SocialLink: React.FC<SocialLinkProps> = ({
  type,
  link,
  label: defaultLabel,
  ariaLabel: customAriaLabel,
}) => {
  const { SocialIcon, label } = React.useMemo(() => {
    switch (type) {
      case 'github': {
        return {
          SocialIcon: GithubIcon,
          label: defaultLabel ?? 'GitHub',
        }
      }

      case 'x': {
        return {
          SocialIcon: XIcon,
          label: defaultLabel ?? 'X',
        }
      }

      case 'twitter': {
        return {
          SocialIcon: TwitterIcon,
          label: defaultLabel ?? 'Twitter',
        }
      }

      case 'instagram': {
        return {
          SocialIcon: InstagramIcon,
          label: defaultLabel ?? 'Instagram',
        }
      }

      case 'zhihu': {
        return {
          SocialIcon: ZhihuIcon,
          label: defaultLabel ?? 'ZhiHu',
        }
      }

      case 'rss': {
        return {
          SocialIcon: Rss,
          label: defaultLabel ?? 'RSS',
        }
      }

      default: {
        return {
          SocialIcon: null,
          label: '',
        }
      }
    }
  }, [defaultLabel, type])

  const ariaLabel = React.useMemo(() => {
    if (customAriaLabel) return customAriaLabel
    return `Visit ${label} in a new tab`
  }, [customAriaLabel, label])

  if (!SocialIcon) return null
  return (
    <Button variant="ghost" size="icon">
      <ExternalLink
        className="flex size-full items-center justify-center"
        href={link}
        title={label}
        aria-label={ariaLabel}
      >
        <SocialIcon className="size-5" />
      </ExternalLink>
    </Button>
  )
}
