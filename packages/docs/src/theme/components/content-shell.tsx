import React from 'react'
import { defineConfig } from '../../config/define-config'
import { buildHeaderNavigation } from '../../navigation/build-header-nav'
import { buildLocaleLinks } from '../../navigation/build-locale-links'
import { buildPager } from '../../navigation/build-pager'
import { resolveSidebar } from '../../navigation/resolve-sidebar'
import { resolveThemeSlots } from '../slots'
import { DefaultContentLayout } from './content-layout'
import { DocsScrollToTop } from './docs-scroll-to-top'
import { DefaultDocsToc, MobileDocsToc } from './docs-toc'
import { DefaultDocsFooter } from './footer'
import { DefaultDocsHeader } from './header'
import { DefaultDocsLink } from './link'
import {
  getFooterDescription,
  getEntrySectionConfig,
  getEntrySectionKey,
  getPagefindFilterEntries,
  getPagefindFilters,
  getSectionEntries,
  getSiteTitle,
  getTocLabels,
  getTocHeadings,
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
  const navigation = buildHeaderNavigation({
    config: normalizedConfig,
    currentHref: entry.href,
    locale: entry.locale,
    source,
  })
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
  const contentTocVisible = tocHeadings.length >= 2
  const tocLabels = getTocLabels(normalizedConfig, entry.locale)
  const homeHref = source.getCanonicalHref(entry.locale, [])
  const slots = resolveThemeSlots(normalizedConfig.slots)
  const ContentHeaderMeta = slots.contentHeaderMeta
  const HeaderActions = slots.headerActions
  const LinkComponent = slots.link ?? DefaultDocsLink
  const Footer = slots.footer ?? DefaultDocsFooter
  const pagefindFilters = getPagefindFilters({
    layout: sectionConfig.layout,
    locale: entry.locale,
    section: sectionKey,
  })
  const pagefindFilterEntries = getPagefindFilterEntries(pagefindFilters)
  const contentToc = contentTocVisible ? (
    <DefaultDocsToc
      headings={tocHeadings}
      {...tocLabels}
      collapseDirection="right"
      collapseEnabled
      dock="fixed"
      className="xl:right-8"
    />
  ) : null
  const mobileToc = contentTocVisible ? (
    <MobileDocsToc headings={tocHeadings} minHeadings={2} {...tocLabels} />
  ) : null

  return (
    <>
      <DefaultDocsHeader
        headerActions={
          HeaderActions ? (
            <HeaderActions
              homeHref={homeHref}
              localeLinks={localeLinks}
              navigation={navigation}
              siteDescription={normalizedConfig.site.description}
              siteTitle={getSiteTitle(normalizedConfig)}
            />
          ) : undefined
        }
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

      <DefaultContentLayout
        footer={
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
        }
        headerMeta={
          ContentHeaderMeta ? <ContentHeaderMeta entry={entry} /> : undefined
        }
        pagefindFilterEntries={pagefindFilterEntries}
        contentTocVisible={contentTocVisible}
        title={entry.title}
      >
        {children}
      </DefaultContentLayout>

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
