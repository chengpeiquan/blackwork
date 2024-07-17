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
   * Options passed to `<ThemeToggle />`
   */
  themeToggleOptions?: ThemeToggleOption[]

  /**
   *
   */
  socialLinks?: SocialLinkProps[]
}

export const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  className,
  wrapperClassName,
  contentClassName,
  children,
  themeToggleOptions,
  socialLinks,
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

        <div className="flex flex-shrink-0 items-center">
          {isArray(socialLinks) && <SocialLinks items={socialLinks} />}

          {!!socialLinks?.length && (
            <Separator orientation="vertical" className="h-5 mx-2" />
          )}

          <ThemeToggle options={themeToggleOptions} />
        </div>
      </div>
    </header>
  )
}
