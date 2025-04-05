import { isArray } from '@bassist/utils'
import React from 'react'
import { Separator } from '@/components/ui'
import { type SocialLinkProps, SocialLinks } from '@/components/widgets'
import { cn } from '@/utils'
import { layoutCls } from './shared'

export interface LayoutHeaderProps {
  /** Class Name for `<header />` */
  className?: string

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
}> = ({ socialLinks, separatorVisible }) => {
  return (
    <>
      {isArray(socialLinks) && <SocialLinks items={socialLinks} />}

      {separatorVisible && (
        <Separator orientation="vertical" className="mx-2 h-5" />
      )}
    </>
  )
}

export const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  socialLinksVisible = true,
  className,
  wrapperClassName,
  contentClassName,
  children,
  socialLinks,
  languageToggle,
  themeToggle,
}) => {
  const cls = cn(
    'sticky top-0 z-10 bg-background/80',
    'shadow-[inset_0_-1px_0_0_#f2f2f2] dark:shadow-[inset_0_-1px_0_0_#333]',
    'backdrop-blur backdrop-saturate-150',
    'box-border flex h-16 w-screen shrink-0 justify-center',
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
    <header className={cls}>
      <div className={wrapperCls}>
        <div className={contentCls}>{children}</div>

        <div className="flex shrink-0 items-center gap-1.5">
          {socialLinksVisible && (
            <SocialLinksRender
              socialLinks={socialLinks}
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
