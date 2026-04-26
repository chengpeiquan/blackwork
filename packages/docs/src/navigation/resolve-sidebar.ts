import { defineConfig } from '../config/define-config'
import type {
  DocsConfig,
  DocsSidebarConfigNode,
  DocsSidebarItemConfig,
  DocsSidebarLabel,
  NormalizedDocsConfig,
} from '../config/types'
import type { DocEntry } from '../source/types'

export interface DocsResolvedSidebarItem {
  type: 'item'
  depth: number
  href: string
  slugSegments: string[]
  title: string
  parentHref?: string
  isActive: boolean
  isExternal: boolean
}

export interface DocsResolvedSidebarGroup {
  type: 'group'
  title: string
  items: DocsResolvedSidebarItem[]
}

export type DocsResolvedSidebarNode =
  | DocsResolvedSidebarGroup
  | DocsResolvedSidebarItem

export interface ResolveSidebarOptions {
  config?: DocsConfig | NormalizedDocsConfig
  currentHref?: string
  entries: DocEntry[]
  sectionKey?: string
}

const getSlugKey = (slugSegments: string[]) => slugSegments.join('/')

const getAncestorEntries = (
  entry: DocEntry,
  entriesBySlug: Map<string, DocEntry>,
) => {
  const ancestors: DocEntry[] = []

  for (let index = 1; index < entry.slugSegments.length; index += 1) {
    const ancestorEntry = entriesBySlug.get(
      getSlugKey(entry.slugSegments.slice(0, index)),
    )

    if (ancestorEntry) {
      ancestors.push(ancestorEntry)
    }
  }

  return ancestors
}

const getLocaleFromEntries = (entries: DocEntry[]) => entries[0]?.locale ?? 'en'

const getSectionEntries = (entries: DocEntry[], sectionKey?: string) => {
  if (!sectionKey) {
    return entries
  }

  return entries.filter((entry) => entry.slugSegments[0] === sectionKey)
}

const resolveLabel = ({
  defaultLocale,
  fallback,
  label,
  locale,
  onError,
}: {
  defaultLocale?: string
  fallback?: string
  label?: DocsSidebarLabel
  locale: string
  onError: () => never
}) => {
  if (typeof label === 'string') {
    return label
  }

  if (label?.[locale]) {
    return label[locale]
  }

  if (defaultLocale && label?.[defaultLocale]) {
    return label[defaultLocale]
  }

  if (fallback) {
    return fallback
  }

  return onError()
}

const resolveInternalPathname = ({
  href,
  siteUrl,
}: {
  href: string
  siteUrl?: string
}) => {
  try {
    const url = new URL(href)
    const configuredSiteUrl = siteUrl ? new URL(siteUrl) : undefined

    if (!configuredSiteUrl || url.origin !== configuredSiteUrl.origin) {
      return null
    }

    return url.pathname
  } catch {
    return href
  }
}

const toSlugSegments = ({
  defaultLocale,
  href,
  locale,
}: {
  defaultLocale?: string
  href: string
  locale: string
}) => {
  const pathname = href.split(/[?#]/u, 1)[0] || '/'
  const segments = pathname.split('/').filter(Boolean)

  if (segments[0] === locale) {
    return segments.slice(1)
  }

  if (defaultLocale && segments[0] === defaultLocale) {
    return segments.slice(1)
  }

  return segments
}

const createInvalidSidebarItemError = ({
  href,
  locale,
  sectionKey,
}: {
  href: string
  locale: string
  sectionKey: string
}) =>
  new Error(
    `[blackwork-docs] Invalid sidebar item in section "${sectionKey}": href "${href}" does not match any document entry in locale "${locale}". Add the page or remove the sidebar item.`,
  )

const resolveManualItem = ({
  currentHref,
  defaultLocale,
  entryLookup,
  item,
  locale,
  sectionKey,
  siteUrl,
}: {
  currentHref?: string
  defaultLocale?: string
  entryLookup: Map<string, DocEntry>
  item: DocsSidebarItemConfig
  locale: string
  sectionKey: string
  siteUrl?: string
}): DocsResolvedSidebarItem => {
  const internalPathname = resolveInternalPathname({
    href: item.href,
    siteUrl,
  })

  if (internalPathname === null) {
    return {
      type: 'item',
      depth: 0,
      href: item.href,
      slugSegments: [],
      title: resolveLabel({
        defaultLocale,
        label: item.label,
        locale,
        onError: () => {
          throw new Error(
            `[blackwork-docs] Invalid sidebar item in section "${sectionKey}": external href "${item.href}" requires a label for locale "${locale}" or defaultLocale "${defaultLocale ?? 'unknown'}".`,
          )
        },
      }),
      isActive: item.href === currentHref,
      isExternal: true,
    }
  }

  const slugSegments = toSlugSegments({
    defaultLocale,
    href: internalPathname,
    locale,
  })
  const targetEntry = entryLookup.get(getSlugKey(slugSegments))

  if (!targetEntry) {
    throw createInvalidSidebarItemError({
      href: item.href,
      locale,
      sectionKey,
    })
  }

  return {
    type: 'item',
    depth: 0,
    href: targetEntry.href,
    slugSegments: [...targetEntry.slugSegments],
    title: resolveLabel({
      defaultLocale,
      fallback: targetEntry.title,
      label: item.label,
      locale,
      onError: () => {
        throw createInvalidSidebarItemError({
          href: item.href,
          locale,
          sectionKey,
        })
      },
    }),
    isActive: targetEntry.href === currentHref,
    isExternal: false,
  }
}

const resolveManualNode = ({
  currentHref,
  defaultLocale,
  entryLookup,
  locale,
  node,
  sectionKey,
  siteUrl,
}: {
  currentHref?: string
  defaultLocale?: string
  entryLookup: Map<string, DocEntry>
  locale: string
  node: DocsSidebarConfigNode
  sectionKey: string
  siteUrl?: string
}): DocsResolvedSidebarNode => {
  if (node.type === 'item') {
    return resolveManualItem({
      currentHref,
      defaultLocale,
      entryLookup,
      item: node,
      locale,
      sectionKey,
      siteUrl,
    })
  }

  return {
    type: 'group',
    title: resolveLabel({
      defaultLocale,
      label: node.label,
      locale,
      onError: () => {
        throw new Error(
          `[blackwork-docs] Invalid sidebar group in section "${sectionKey}": label is required for locale "${locale}" or defaultLocale "${defaultLocale ?? 'unknown'}".`,
        )
      },
    }),
    items: node.items.map((item) =>
      resolveManualItem({
        currentHref,
        defaultLocale,
        entryLookup,
        item,
        locale,
        sectionKey,
        siteUrl,
      }),
    ),
  }
}

const resolveAutoSidebar = ({
  currentHref,
  entries,
}: {
  currentHref?: string
  entries: DocEntry[]
}): DocsResolvedSidebarItem[] => {
  const entriesBySlug = new Map(
    entries.map((entry) => [getSlugKey(entry.slugSegments), entry] as const),
  )

  return entries.map((entry) => {
    const ancestorEntries = getAncestorEntries(entry, entriesBySlug)
    const parentEntry = ancestorEntries.at(-1)
    const depth = Math.max(entry.slugSegments.length - 1, 0)

    return {
      type: 'item',
      depth,
      href: entry.href,
      slugSegments: [...entry.slugSegments],
      title: entry.title,
      ...(parentEntry ? { parentHref: parentEntry.href } : {}),
      isActive: entry.href === currentHref,
      isExternal: false,
    }
  })
}

export const flattenResolvedSidebarItems = (
  nodes: DocsResolvedSidebarNode[],
): DocsResolvedSidebarItem[] =>
  nodes.flatMap((node) => (node.type === 'group' ? node.items : node))

export function resolveSidebar({
  config,
  currentHref,
  entries,
  sectionKey,
}: ResolveSidebarOptions): DocsResolvedSidebarNode[] {
  const normalizedConfig = defineConfig(config)
  const locale = getLocaleFromEntries(entries)
  const sectionConfig = sectionKey
    ? normalizedConfig.content.sections?.[sectionKey]
    : undefined
  const sidebar = sectionConfig?.sidebar ?? 'auto'

  if (sidebar === false) {
    return []
  }

  if (sidebar === 'auto') {
    return resolveAutoSidebar({
      currentHref,
      entries: getSectionEntries(entries, sectionKey),
    })
  }

  const entryLookup = new Map(
    entries.map((entry) => [getSlugKey(entry.slugSegments), entry] as const),
  )

  return sidebar.map((node) =>
    resolveManualNode({
      currentHref,
      defaultLocale: normalizedConfig.content.defaultLocale,
      entryLookup,
      locale,
      node,
      sectionKey: sectionKey ?? 'root',
      siteUrl: normalizedConfig.site.url,
    }),
  )
}
