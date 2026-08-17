import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LayoutHeader,
  ThemeToggle,
} from 'blackwork'
import { Check, Languages, Menu } from 'lucide-react'
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

const navItemClassName = (current: boolean) =>
  current
    ? 'font-medium text-foreground'
    : 'text-muted-foreground hover:text-foreground'

export const DefaultDocsHeader: React.FC<DefaultDocsHeaderProps> = ({
  headerActions,
  homeHref,
  LinkComponent = DefaultDocsLink,
  localeLinks = [],
  navigation = [],
  siteTitle,
}) => {
  return (
    <LayoutHeader
      data-docs-region="header"
      socialLinksVisible={false}
      wrapperClassName="mx-auto w-full max-w-screen-2xl px-6 sm:px-8 md:px-10 lg:px-12 xl:px-14"
      contentClassName="min-w-0 gap-3 md:gap-6"
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
        className="shrink-0 truncate text-lg font-semibold text-foreground"
      >
        {siteTitle}
      </LinkComponent>

      {navigation.length > 0 ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open site navigation"
              >
                <Menu className="size-5" aria-hidden="true" />
                <span className="sr-only">Open site navigation</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="border-border">
              {navigation.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <LinkComponent
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={navItemClassName(item.current)}
                  >
                    {item.label}
                  </LinkComponent>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <nav
            aria-label="Primary navigation"
            data-docs-region="header-nav"
            className="hidden min-w-0 items-center gap-1 md:flex"
          >
            {navigation.map((item) => (
              <LinkComponent
                key={item.href}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={`rounded-md px-2.5 py-1.5 text-sm transition-colors ${navItemClassName(item.current)}`}
              >
                {item.label}
              </LinkComponent>
            ))}
          </nav>
        </>
      ) : null}

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
