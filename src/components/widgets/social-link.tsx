import React from 'react'
import { Button } from '@/components/ui'
import { Github, Instagram, Rss, Twitter, X, ZhiHu } from '@/icons'
import { ExternalLink } from './external-link'

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
  const { SocialIcon, label } = useMemo(() => {
    switch (type) {
      case 'github': {
        return {
          SocialIcon: Github,
          label: defaultLabel ?? 'GitHub',
        }
      }

      case 'x': {
        return {
          SocialIcon: X,
          label: defaultLabel ?? 'X',
        }
      }

      case 'twitter': {
        return {
          SocialIcon: Twitter,
          label: defaultLabel ?? 'Twitter',
        }
      }

      case 'instagram': {
        return {
          SocialIcon: Instagram,
          label: defaultLabel ?? 'Instagram',
        }
      }

      case 'zhihu': {
        return {
          SocialIcon: ZhiHu,
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

  const ariaLabel = useMemo(() => {
    if (customAriaLabel) return customAriaLabel
    return `Visit ${label} in a new tab`
  }, [customAriaLabel, label])

  if (!SocialIcon) return null
  return (
    <Button variant="ghost" size="icon">
      <ExternalLink
        className="flex items-center justify-center w-full h-full"
        href={link}
        title={label}
        aria-label={ariaLabel}
      >
        <SocialIcon className="h-5 w-5" />
      </ExternalLink>
    </Button>
  )
}
