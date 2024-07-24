import React from 'react'
import { isArray } from '@bassist/utils'
import { cn } from '@/utils'
import { Separator } from '@/components/ui'
import { type SocialLinkProps, SocialLinks } from '@/components/widgets'

export interface LayoutHeaderProps {
  /**
   * Class Name for `<header />`
   */
  className?: string

  wrapperClassName?: string

  contentClassName?: string

  children: React.ReactNode

  /**
   * Passing this array will render a set of social link icon buttons
   */
  socialLinks?: SocialLinkProps[]

  /**
   * If i18n is supported, a button to toggle languages can be passed
   */
  languageToggle?: React.ReactNode

  /**
   * The configuration passed to `<ThemeToggle />`
   */
  themeToggle?: React.ReactNode
}

export const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  className,
  wrapperClassName,
  contentClassName,
  children,
  socialLinks,
  languageToggle,
  themeToggle,
}) => {
  const cls = cn(
    'sticky top-0 z-10 bg-background/90 blackwork__layout--header',
    'flex flex-shrink-0 justify-center container h-16 box-border px-6 sm:px-8',
    className,
  )

  const wrapperCls = cn(
    'flex justify-between items-center gap-6 w-full h-full',
    wrapperClassName,
  )

  const contentCls = cn(
    'flex flex-1 items-center h-full overflow-hidden',
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

        <div className="flex flex-shrink-0 items-center gap-1.5">
          {isArray(socialLinks) && <SocialLinks items={socialLinks} />}

          {separatorVisible && (
            <Separator orientation="vertical" className="h-5 mx-2" />
          )}

          {languageToggle}

          {themeToggle}
        </div>
      </div>
    </header>
  )
}
