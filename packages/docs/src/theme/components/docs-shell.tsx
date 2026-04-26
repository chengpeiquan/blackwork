import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'blackwork'
import { Menu } from 'blackwork/icons'
import React from 'react'
import { defineConfig } from '../../config/define-config'
import { buildLocaleLinks } from '../../navigation/build-locale-links'
import { buildPager } from '../../navigation/build-pager'
import { buildSidebar } from '../../navigation/build-sidebar'
import {
  flattenResolvedSidebarItems,
  resolveSidebar,
  type DocsResolvedSidebarItem,
  type DocsResolvedSidebarNode,
} from '../../navigation/resolve-sidebar'
import { resolveThemeSlots } from '../slots'
import { DocsRailScroll } from './docs-rail-scroll'
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
import type { DocsThemeLinkComponent } from '../types'
import type { HeadingItem } from '@blackwork/machine'

export interface DefaultDocsShellProps {
  children: React.ReactNode
  config?: DocsConfig | NormalizedDocsConfig
  entry: DocEntry
  headings?: HeadingItem[]
  source: DocsSource
}

const getSidebarLinkClassName = (isActive: boolean) =>
  [
    'block rounded-md py-1.5 pr-3 text-sm transition-colors',
    isActive
      ? 'bg-accent font-medium text-accent-foreground'
      : 'text-muted-foreground hover:text-foreground',
  ].join(' ')

const isRenderableSidebarItem = (item: DocsResolvedSidebarItem) =>
  item.isExternal || item.slugSegments.length > 0

const getRenderableSidebarNodes = (nodes: DocsResolvedSidebarNode[]) =>
  nodes.flatMap((node) => {
    if (node.type === 'group') {
      const items = node.items.filter(isRenderableSidebarItem)

      if (items.length === 0) {
        return []
      }

      return [
        {
          ...node,
          items,
        },
      ]
    }

    return isRenderableSidebarItem(node) ? [node] : []
  })

interface DocsSidebarNavProps {
  LinkComponent: DocsThemeLinkComponent
  nodes: DocsResolvedSidebarNode[]
}

const DocsSidebarNav: React.FC<DocsSidebarNavProps> = ({
  LinkComponent,
  nodes,
}) => (
  <nav aria-label="Documentation pages" className="flex flex-col gap-1">
    {nodes.map((node) =>
      node.type === 'group' ? (
        <div key={node.title} className="flex flex-col gap-1 pt-4 first:pt-0">
          <p className="px-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground/80">
            {node.title}
          </p>

          {node.items.map((item) => (
            <LinkComponent
              key={item.href}
              href={item.href}
              aria-current={item.isActive ? 'page' : undefined}
              data-current-page={item.isActive ? 'true' : undefined}
              className={getSidebarLinkClassName(item.isActive)}
              style={{
                paddingLeft: `${0.75 + item.depth * 0.75}rem`,
              }}
            >
              {item.title}
            </LinkComponent>
          ))}
        </div>
      ) : (
        <LinkComponent
          key={node.href}
          href={node.href}
          aria-current={node.isActive ? 'page' : undefined}
          data-current-page={node.isActive ? 'true' : undefined}
          className={getSidebarLinkClassName(node.isActive)}
          style={{
            paddingLeft: `${0.75 + node.depth * 0.75}rem`,
          }}
        >
          {node.title}
        </LinkComponent>
      ),
    )}
  </nav>
)

interface MobileDocsSidebarProps extends DocsSidebarNavProps {
  currentTitle: string
}

const MobileDocsSidebar: React.FC<MobileDocsSidebarProps> = ({
  currentTitle,
  LinkComponent,
  nodes,
}) => {
  if (nodes.length === 0) {
    return null
  }

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="outline"
            aria-label="Open section navigation"
            className="h-auto w-full justify-start gap-3 rounded-lg px-4 py-3"
          >
            <Menu className="size-4 shrink-0" aria-hidden="true" />
            <span className="flex min-w-0 flex-1 flex-col items-start text-left">
              <span className="text-xs text-muted-foreground">Sections</span>
              <span className="truncate text-sm font-medium text-foreground">
                {currentTitle}
              </span>
            </span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="flex h-dvh flex-col gap-0 p-0 sm:max-w-sm"
        >
          <SheetHeader className="border-b border-border/60 px-6 pb-4 pt-[calc(env(safe-area-inset-top)+1.5rem)] text-left">
            <SheetTitle>Sections</SheetTitle>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-auto px-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-4">
            <DocsSidebarNav LinkComponent={LinkComponent} nodes={nodes} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export const DefaultDocsShell: React.FC<DefaultDocsShellProps> = ({
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
  const resolvedSidebar = resolveSidebar({
    config: normalizedConfig,
    entries,
    currentHref: entry.href,
    sectionKey,
  })
  const renderableSidebarNodes = getRenderableSidebarNodes(resolvedSidebar)
  const pager = buildPager({
    entries: sectionEntries,
    currentHref: entry.href,
    ...(usesManualSidebar ? { sidebar: resolvedSidebar } : {}),
  })
  const navigation = toNavigation(
    entry,
    usesManualSidebar
      ? flattenResolvedSidebarItems(resolvedSidebar)
      : buildSidebar({
          entries,
          currentHref: entry.href,
        }),
  )
  const localeLinks = buildLocaleLinks({
    config: normalizedConfig,
    entry,
    source,
  })
  const tocHeadings = getTocHeadings(headings)
  const homeHref = source.getCanonicalHref(entry.locale, [])
  const slots = resolveThemeSlots(normalizedConfig.slots)
  const LinkComponent = slots.link ?? DefaultDocsLink
  const Footer = slots.footer ?? DefaultDocsFooter

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

      <MobileDocsToc headings={tocHeadings} />

      <main
        data-docs-region="docs-shell"
        className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6 px-6 py-8 sm:gap-8 sm:px-8 lg:flex-row lg:gap-14 xl:gap-20 xl:px-10 2xl:gap-24 2xl:px-12"
      >
        <MobileDocsSidebar
          currentTitle={entry.title}
          LinkComponent={LinkComponent}
          nodes={renderableSidebarNodes}
        />

        <aside
          data-docs-region="sidebar"
          className="hidden w-full shrink-0 lg:block lg:w-72 lg:self-start lg:sticky lg:top-24"
        >
          <DocsRailScroll>
            <DocsSidebarNav
              LinkComponent={LinkComponent}
              nodes={renderableSidebarNodes}
            />
          </DocsRailScroll>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-10">
          <header
            data-docs-region="article-header"
            className="flex flex-col gap-3 border-b border-border/60 pb-6"
          >
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground">
              {entry.title}
            </h1>

            {entry.description ? (
              <p className="max-w-3xl text-pretty text-muted-foreground">
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

        <DefaultDocsToc headings={tocHeadings} />
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
