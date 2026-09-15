import { isArray } from '@bassist/utils'
import React, { useMemo } from 'react'
import { GlassMaterial } from '@/components/effects/glass-surface'
import { Separator } from '@/components/ui'
import { type SocialLinkProps, SocialLinks } from '@/components/widgets'
import { cn } from '@/utils'
import { layoutCls } from './shared'

export interface LayoutHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Class Name for `<header />` */
  className?: string

  appearance?: 'default' | 'glass'

  wrapperClassName?: string

  contentClassName?: string

  children: React.ReactNode

  /**
   * In addition to rendering based on the validity of the incoming data, this
   * option can limit whether social links are rendered when there is data.
   *
   * @default true
   */
  socialLinksVisible?: boolean

  /** Passing this array will render a set of social link icon buttons */
  socialLinks?: SocialLinkProps[]

  /** If i18n is supported, a button to toggle languages can be passed */
  languageToggle?: React.ReactNode

  /** The configuration passed to `<ThemeToggle />` */
  themeToggle?: React.ReactNode
}

const SocialLinksRender: React.FC<{
  socialLinks?: SocialLinkProps[]
  separatorVisible: boolean
  appearance: 'default' | 'glass'
}> = ({ socialLinks, separatorVisible, appearance }) => {
  return (
    <>
      {isArray(socialLinks) && (
        <SocialLinks
          items={socialLinks}
          variant={appearance === 'glass' ? 'glass' : 'ghost'}
        />
      )}

      {separatorVisible && (
        <Separator orientation="vertical" className="mx-2 h-5" />
      )}
    </>
  )
}

export const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  socialLinksVisible = true,
  className,
  appearance = 'default',
  wrapperClassName,
  contentClassName,
  children,
  socialLinks,
  languageToggle,
  themeToggle,
  ...props
}) => {
  const cls = cn(
    'sticky top-0 z-10',
    appearance === 'default' &&
      'bg-background/80 shadow-[inset_0_-1px_0_0_#f2f2f2] dark:shadow-[inset_0_-1px_0_0_#333] backdrop-blur-sm backdrop-saturate-150',
    'box-border flex h-16 w-screen shrink-0 justify-center',
    appearance === 'glass' && 'bw-glass-header',
    className,
  )

  const wrapperCls = cn(
    'flex h-full items-center justify-between gap-6',
    layoutCls.container,
    wrapperClassName,
  )

  const contentCls = cn(
    'flex h-full flex-1 items-center overflow-hidden',
    contentClassName,
  )

  const separatorVisible = useMemo(() => {
    const hasLeftPart = !!socialLinks?.length
    const hasRightPart = !!themeToggle || !!languageToggle
    return hasLeftPart && hasRightPart
  }, [languageToggle, socialLinks?.length, themeToggle])

  return (
    <header {...props} className={cls}>
      {appearance === 'glass' && <GlassMaterial refraction={68} blur={3} />}
      <div className={wrapperCls}>
        <div className={contentCls}>{children}</div>

        <div className="flex shrink-0 items-center gap-1.5">
          {socialLinksVisible && (
            <SocialLinksRender
              socialLinks={socialLinks}
              appearance={appearance}
              separatorVisible={separatorVisible}
            />
          )}

          {languageToggle}

          {themeToggle}
        </div>
      </div>
    </header>
  )
}
