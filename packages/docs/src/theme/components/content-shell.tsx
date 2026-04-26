import React from 'react'
import { defineConfig } from '../../config/define-config'
import { buildLocaleLinks } from '../../navigation/build-locale-links'
import { buildPager } from '../../navigation/build-pager'
import { buildSidebar } from '../../navigation/build-sidebar'
import {
  flattenResolvedSidebarItems,
  resolveSidebar,
} from '../../navigation/resolve-sidebar'
import { resolveThemeSlots } from '../slots'
import { DocsScrollToTop } from './docs-scroll-to-top'
import { DefaultDocsToc, MobileDocsToc } from './docs-toc'
import { DefaultDocsFooter } from './footer'
import { DefaultDocsHeader } from './header'
import { DefaultDocsLink } from './link'
import {
  getFooterDescription,
  getEntrySectionConfig,
  getEntrySectionKey,
  getSectionEntries,
  getSiteTitle,
  getTocHeadings,
  toNavigation,
} from './shell-shared'
import type { DocsConfig, NormalizedDocsConfig } from '../../config/types'
import type { DocEntry, DocsSource } from '../../source/types'
import type { HeadingItem } from '@blackwork/machine'

export interface DefaultContentShellProps {
  children: React.ReactNode
  config?: DocsConfig | NormalizedDocsConfig
  entry: DocEntry
  headings?: HeadingItem[]
  source: DocsSource
}

export const DefaultContentShell: React.FC<DefaultContentShellProps> = ({
  children,
  config,
  entry,
  headings = [],
  source,
}) => {
  const normalizedConfig = defineConfig(config)
  const entries = source.getEntries(entry.locale)
  const sectionKey = getEntrySectionKey(entry)
  const sectionConfig = getEntrySectionConfig(normalizedConfig, entry)
  const usesManualSidebar = Array.isArray(sectionConfig.sidebar)
  const sectionEntries = getSectionEntries(entries, entry)
  const resolvedSidebar = usesManualSidebar
    ? resolveSidebar({
        config: normalizedConfig,
        entries,
        currentHref: entry.href,
        sectionKey,
      })
    : []
  const navigation = toNavigation(
    entry,
    usesManualSidebar
      ? flattenResolvedSidebarItems(resolvedSidebar)
      : buildSidebar({
          entries,
          currentHref: entry.href,
        }),
  )
  const pager = buildPager({
    entries: sectionEntries,
    currentHref: entry.href,
    ...(usesManualSidebar ? { sidebar: resolvedSidebar } : {}),
  })
  const localeLinks = buildLocaleLinks({
    config: normalizedConfig,
    entry,
    source,
  })
  const tocHeadings = getTocHeadings(headings)
  const showsContentToc = tocHeadings.length >= 2
  const homeHref = source.getCanonicalHref(entry.locale, [])
  const slots = resolveThemeSlots(normalizedConfig.slots)
  const LinkComponent = slots.link ?? DefaultDocsLink
  const Footer = slots.footer ?? DefaultDocsFooter
  const contentToc = showsContentToc ? (
    <DefaultDocsToc
      headings={tocHeadings}
      collapseEnabled
      dock="fixed"
      className="xl:left-8"
    />
  ) : null
  const mobileToc = showsContentToc ? (
    <MobileDocsToc headings={tocHeadings} minHeadings={2} />
  ) : null

  return (
    <>
      <DefaultDocsHeader
        homeHref={homeHref}
        LinkComponent={LinkComponent}
        localeLinks={localeLinks}
        navigation={navigation}
        siteDescription={normalizedConfig.site.description}
        siteTitle={getSiteTitle(normalizedConfig)}
      />

      <DocsScrollToTop />

      {mobileToc}
      {contentToc}

      <main
        data-docs-region="content-shell"
        className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-6 py-8 sm:px-8 xl:flex-row xl:items-start xl:gap-12 xl:px-10 2xl:gap-16 2xl:px-12"
      >
        {showsContentToc ? (
          <div aria-hidden="true" className="hidden w-64 shrink-0 xl:block" />
        ) : null}

        <div className="flex min-w-0 flex-1 justify-center">
          <div className="flex w-full max-w-4xl flex-col gap-10">
            <header
              data-docs-region="article-header"
              className="flex flex-col gap-3 border-b border-border/60 pb-6"
            >
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {entry.title}
              </h1>

              {entry.description ? (
                <p className="max-w-3xl text-muted-foreground">
                  {entry.description}
                </p>
              ) : null}
            </header>

            <article
              data-docs-region="article-body"
              className="prose prose-neutral max-w-none dark:prose-invert"
            >
              {children}
            </article>

            <nav
              data-docs-region="pager"
              aria-label="Document pager"
              className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6 text-sm"
            >
              {pager.previous ? (
                <LinkComponent
                  href={pager.previous.href}
                  className="text-muted-foreground"
                >
                  Previous: {pager.previous.title}
                </LinkComponent>
              ) : (
                <span />
              )}

              {pager.next ? (
                <LinkComponent
                  href={pager.next.href}
                  className="text-muted-foreground"
                >
                  Next: {pager.next.title}
                </LinkComponent>
              ) : null}
            </nav>
          </div>
        </div>

        {showsContentToc ? (
          <div aria-hidden="true" className="hidden w-64 shrink-0 xl:block" />
        ) : null}
      </main>

      <Footer
        description={getFooterDescription(normalizedConfig, entry)}
        homeHref={homeHref}
        LinkComponent={LinkComponent}
        navigation={navigation}
        siteTitle={getSiteTitle(normalizedConfig)}
      />
    </>
  )
}
