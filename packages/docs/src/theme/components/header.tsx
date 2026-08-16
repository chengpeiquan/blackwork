import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LayoutHeader,
  ThemeToggle,
} from 'blackwork'
import { Check, Languages } from 'lucide-react'
import React from 'react'
import { DefaultDocsLink } from './link'
import type {
  DocsThemeLinkComponent,
  DocsThemeLocaleLink,
  DocsThemeNavItem,
} from '../types'

export interface DefaultDocsHeaderProps {
  headerActions?: React.ReactNode
  homeHref: string
  LinkComponent?: DocsThemeLinkComponent
  localeLinks?: DocsThemeLocaleLink[]
  navigation: DocsThemeNavItem[]
  siteDescription?: string
  siteTitle: string
}

const getLocaleLabel = (link: DocsThemeLocaleLink) => link.label || link.locale

interface DefaultLocaleToggleProps {
  LinkComponent: DocsThemeLinkComponent
  localeLinks: DocsThemeLocaleLink[]
}

const DefaultLocaleToggle: React.FC<DefaultLocaleToggleProps> = ({
  LinkComponent,
  localeLinks,
}) => {
  if (localeLinks.length <= 1) {
    return null
  }

  const currentLocale = localeLinks.find((item) => item.current)
  const title = currentLocale
    ? `Change language: ${getLocaleLabel(currentLocale)}`
    : 'Change language'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title={title}
          aria-label="Change language"
          data-current-locale={currentLocale ? 'true' : undefined}
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Languages className="size-5" aria-hidden="true" />
          <span className="sr-only">{title}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="border-border">
        {localeLinks.map((item) => (
          <DropdownMenuItem
            key={item.href}
            asChild
            className={
              item.current
                ? 'gap-3 font-medium text-foreground'
                : 'gap-3 text-muted-foreground'
            }
          >
            <LinkComponent
              href={item.href}
              hrefLang={item.lang}
              aria-current={item.current ? 'page' : undefined}
              data-current-locale={item.current ? 'true' : undefined}
            >
              <span
                aria-hidden="true"
                className="flex size-4 items-center justify-center"
                data-current-locale-indicator={item.current ? '' : undefined}
              >
                {item.current ? <Check className="size-4" /> : null}
              </span>
              {getLocaleLabel(item)}
            </LinkComponent>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const DefaultDocsHeader: React.FC<DefaultDocsHeaderProps> = ({
  headerActions,
  homeHref,
  LinkComponent = DefaultDocsLink,
  localeLinks = [],
  siteTitle,
}) => {
  return (
    <LayoutHeader
      data-docs-region="header"
      socialLinksVisible={false}
      wrapperClassName="mx-auto w-full max-w-screen-2xl px-6 sm:px-8 md:px-10 lg:px-12 xl:px-14"
      contentClassName="min-w-0"
      className="border-b border-border/60"
      languageToggle={
        <DefaultLocaleToggle
          LinkComponent={LinkComponent}
          localeLinks={localeLinks}
        />
      }
      themeToggle={
        <ThemeToggle title="Toggle theme" ariaLabel="Toggle theme" />
      }
    >
      <LinkComponent
        href={homeHref}
        data-docs-region="header-brand"
        className="truncate text-lg font-semibold text-foreground"
      >
        {siteTitle}
      </LinkComponent>

      {headerActions ? (
        <div
          data-docs-region="header-actions"
          className="ml-auto hidden items-center pl-4 md:flex"
        >
          {headerActions}
        </div>
      ) : null}
    </LayoutHeader>
  )
}
