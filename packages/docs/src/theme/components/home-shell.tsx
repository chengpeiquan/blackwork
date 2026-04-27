import { Badge, Button, Card, CardContent, Separator } from 'blackwork'
import React from 'react'
import { defineConfig } from '../../config/define-config'
import { buildLocaleLinks } from '../../navigation/build-locale-links'
import { buildSidebar } from '../../navigation/build-sidebar'
import { createHomeData } from '../create-home-data'
import { resolveThemeSlots } from '../slots'
import { DocsScrollToTop } from './docs-scroll-to-top'
import { DefaultDocsHeader } from './header'
import { DefaultDocsLink } from './link'
import { getPagefindFilterEntries, getPagefindFilters } from './shell-shared'
import type { DocsConfig, NormalizedDocsConfig } from '../../config/types'
import type { DocEntry, DocsSource } from '../../source/types'
import type { DocsThemeLocaleLink, DocsThemeNavItem } from '../types'

export interface DefaultHomeShellProps {
  config?: DocsConfig | NormalizedDocsConfig
  locale: string
  source: DocsSource
}

const getSiteTitle = (config: NormalizedDocsConfig) =>
  config.site.title || 'Documentation'

const getLocaleLinks = (
  config: NormalizedDocsConfig,
  locale: string,
  source: DocsSource,
): DocsThemeLocaleLink[] => {
  const homeEntry = source.getEntry(locale, [])

  if (homeEntry) {
    return buildLocaleLinks({
      config,
      entry: homeEntry,
      source,
    })
  }

  return source.getLocaleCodes().map((code) => {
    const definition = Object.values(config.content.locales ?? {}).find(
      (item) => item.code === code,
    )

    return {
      locale: code,
      href: source.getCanonicalHref(code, []),
      label: definition?.label,
      lang: definition?.lang,
      current: code === locale,
    }
  })
}

const toNavigation = (
  currentEntry: DocEntry | null,
  items: ReturnType<typeof buildSidebar>,
): DocsThemeNavItem[] => {
  return items
    .filter((item) => item.depth === 0)
    .map((item) => ({
      href: item.href,
      label: item.title,
      current: currentEntry?.href === item.href,
    }))
}

export const DefaultHomeShell: React.FC<DefaultHomeShellProps> = ({
  config,
  locale,
  source,
}) => {
  const normalizedConfig = defineConfig(config)
  const entries = source.getEntries(locale)
  const homeEntry = source.getEntry(locale, [])
  const home = createHomeData({
    config: normalizedConfig,
    locale,
    source,
  })
  const navigation = toNavigation(
    homeEntry,
    buildSidebar({
      entries,
      currentHref: home.homeHref,
    }),
  )
  const localeLinks = getLocaleLinks(normalizedConfig, locale, source)
  const slots = resolveThemeSlots(normalizedConfig.slots)
  const HeaderActions = slots.headerActions
  const LinkComponent = slots.link ?? DefaultDocsLink
  const pagefindFilters = getPagefindFilters({
    locale,
  })
  const pagefindFilterEntries = getPagefindFilterEntries(pagefindFilters)

  return (
    <>
      <DefaultDocsHeader
        headerActions={
          HeaderActions ? (
            <HeaderActions
              homeHref={home.homeHref}
              localeLinks={localeLinks}
              navigation={navigation}
              siteDescription={normalizedConfig.site.description}
              siteTitle={getSiteTitle(normalizedConfig)}
            />
          ) : undefined
        }
        homeHref={home.homeHref}
        LinkComponent={LinkComponent}
        localeLinks={localeLinks}
        navigation={navigation}
        siteDescription={normalizedConfig.site.description}
        siteTitle={getSiteTitle(normalizedConfig)}
      />

      <DocsScrollToTop />

      <main
        data-docs-region="home-shell"
        className="flex min-h-[calc(100dvh-4rem)] w-full flex-col bg-background px-6 py-10"
      >
        <section
          data-docs-region="home-hero"
          data-home-mode={home.mode}
          data-pagefind-body=""
          className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-8 text-center"
        >
          <div hidden>
            {pagefindFilterEntries.map((filter) => (
              <span key={filter} data-pagefind-filter={filter} />
            ))}
          </div>

          {home.badge || home.eyebrow ? (
            <Badge
              variant="secondary"
              className="max-w-full gap-2 px-4 py-2 text-sm font-medium"
            >
              {home.badge ? (
                <span className="truncate">{home.badge}</span>
              ) : null}
              {home.badge && home.eyebrow ? (
                <Separator
                  orientation="vertical"
                  aria-hidden="true"
                  className="h-4 bg-border"
                />
              ) : null}
              {home.eyebrow ? (
                <span className="truncate text-muted-foreground">
                  {home.eyebrow}
                </span>
              ) : null}
            </Badge>
          ) : null}

          <div className="flex flex-col items-center gap-6">
            <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-none text-foreground sm:text-6xl lg:text-7xl">
              {home.title}
            </h1>
            <p className="max-w-3xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              {home.description}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 text-base font-medium sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-6 shadow-sm">
              <LinkComponent href={home.primaryAction.href}>
                {home.primaryAction.label}
              </LinkComponent>
            </Button>

            {home.secondaryAction ? (
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="rounded-full px-6"
              >
                <LinkComponent href={home.secondaryAction.href}>
                  {home.secondaryAction.label}
                </LinkComponent>
              </Button>
            ) : null}
          </div>
        </section>

        {home.highlights.length > 0 ? (
          <section
            data-docs-region="home-highlights"
            className="mx-auto grid w-full max-w-6xl gap-4 pb-16 md:grid-cols-3"
          >
            {home.highlights.map((item) => (
              <LinkComponent
                key={item.href}
                href={item.href}
                className="block transition-colors"
              >
                <Card className="h-full border-border/60 transition-colors hover:bg-accent hover:text-accent-foreground">
                  <CardContent className="flex flex-col gap-2 p-4">
                    <h2 className="text-lg font-medium text-foreground">
                      {item.title}
                    </h2>
                    <p className="text-pretty text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </LinkComponent>
            ))}
          </section>
        ) : null}
      </main>
    </>
  )
}
