import React from 'react'
import { isArray } from '@bassist/utils'
import { cn } from '@/utils'
import { Separator } from '@/components/ui'
import { ThemeToggle, type ThemeToggleOption } from '@/components/theme'
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
   * Options passed to `<ThemeToggle />`
   */
  themeToggleOptions?: ThemeToggleOption[]
}

export const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  className,
  wrapperClassName,
  contentClassName,
  children,
  socialLinks,
  languageToggle,
  themeToggleOptions,
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

  return (
    <header className={cls}>
      <div className={wrapperCls}>
        <div className={contentCls}>{children}</div>

        <div className="flex flex-shrink-0 items-center gap-1.5">
          {isArray(socialLinks) && <SocialLinks items={socialLinks} />}

          {(!!languageToggle || !!socialLinks?.length) && (
            <Separator orientation="vertical" className="h-5 mx-2" />
          )}

          {languageToggle}

          <ThemeToggle options={themeToggleOptions} />
        </div>
      </div>
    </header>
  )
}
