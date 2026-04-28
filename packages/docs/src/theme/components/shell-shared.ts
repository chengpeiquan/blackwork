import type { DocsTocHeading } from './docs-toc'
import type {
  DocsConfig,
  DocsThemeLocalizedLabel,
  NormalizedDocsConfig,
  NormalizedDocsContentSectionConfig,
} from '../../config/types'
import type { DocsSidebarItem } from '../../navigation/build-sidebar'
import type { DocEntry } from '../../source/types'
import type { DocsThemeNavItem } from '../types'
import type { HeadingItem } from '@blackwork/machine'

const DEFAULT_SECTION_CONFIG: NormalizedDocsContentSectionConfig = {
  layout: 'docs',
  sidebar: 'auto',
}

export const getSiteTitle = (config: NormalizedDocsConfig) =>
  config.site.title || 'Documentation'

export const getFooterDescription = (
  config: NormalizedDocsConfig,
  entry: DocEntry,
) =>
  config.site.description ||
  entry.description ||
  'Browse the available documentation.'

export const getLocalizedLabel = (
  value: DocsThemeLocalizedLabel | undefined,
  locale: string,
  fallback: string,
) => {
  if (typeof value === 'string') {
    return value
  }

  return value?.[locale] ?? fallback
}

export const getTocLabels = (config: NormalizedDocsConfig, locale: string) => ({
  collapseLabel: getLocalizedLabel(
    config.theme.toc?.collapseLabel,
    locale,
    'Collapse outline',
  ),
  expandLabel: getLocalizedLabel(
    config.theme.toc?.expandLabel,
    locale,
    'Expand outline',
  ),
  openLabel: getLocalizedLabel(
    config.theme.toc?.openLabel,
    locale,
    'Open outline',
  ),
  title: getLocalizedLabel(config.theme.toc?.title, locale, 'On This Page'),
})

const matchesNavigation = (
  entry: DocEntry,
  href: string,
  slugSegments: string[],
) => {
  if (href === entry.href) {
    return true
  }

  if (slugSegments.length === 0) {
    return false
  }

  return slugSegments.every(
    (segment, index) => entry.slugSegments[index] === segment,
  )
}

export const toNavigation = (
  currentEntry: DocEntry,
  items: DocsSidebarItem[],
): DocsThemeNavItem[] => {
  return items
    .filter((item) => item.depth === 0)
    .map((item) => ({
      href: item.href,
      label: item.title,
      current: matchesNavigation(currentEntry, item.href, item.slugSegments),
    }))
}

export const getTocHeadings = (headings: HeadingItem[]): DocsTocHeading[] =>
  headings.flatMap((heading) => {
    const children = heading.children ? getTocHeadings(heading.children) : []

    if ((heading.depth ?? 0) <= 1) {
      return children
    }

    return [
      {
        depth: heading.depth ?? 2,
        id: heading.id,
        title: heading.value ?? heading.id,
      },
      ...children,
    ]
  })

export const getEntrySectionKey = (entry: DocEntry) => entry.slugSegments[0]

export const getSectionEntries = (entries: DocEntry[], entry: DocEntry) => {
  const sectionKey = getEntrySectionKey(entry)

  if (!sectionKey) {
    return entries
  }

  return entries.filter((candidate) => candidate.slugSegments[0] === sectionKey)
}

export const getEntrySectionConfig = (
  config: DocsConfig | NormalizedDocsConfig,
  entry: DocEntry,
): NormalizedDocsContentSectionConfig => {
  const sectionKey = getEntrySectionKey(entry)

  if (!sectionKey) {
    return DEFAULT_SECTION_CONFIG
  }

  const section = config.content?.sections?.[sectionKey]
  const layout = section?.layout ?? DEFAULT_SECTION_CONFIG.layout

  return {
    layout,
    sidebar:
      section?.sidebar ??
      (layout === 'content' ? false : DEFAULT_SECTION_CONFIG.sidebar),
  }
}

const normalizeLocalePart = (value: string | undefined) => value?.trim()

export const deriveLocaleFamily = (locale: string) => {
  const parts = locale
    .split(/[-_]/u)
    .map((part) => normalizeLocalePart(part))
    .filter((part): part is string => Boolean(part))
  const language = parts[0]?.toLowerCase()
  const region = parts
    .slice(1)
    .find((part) => /^(?:[A-Za-z]{2}|\d{3})$/u.test(part))
    ?.toUpperCase()

  return {
    language,
    region,
  }
}

export const getPagefindFilters = ({
  kind = 'docs',
  layout,
  locale,
  section,
}: {
  kind?: string
  layout?: string
  locale: string
  section?: string
}) => {
  const { language, region } = deriveLocaleFamily(locale)

  return {
    kind,
    locale,
    ...(language ? { language } : {}),
    ...(region ? { region } : {}),
    ...(section ? { section } : {}),
    ...(layout ? { layout } : {}),
  }
}

export const getPagefindFilterEntries = (filters: Record<string, string>) =>
  Object.entries(filters).map(([key, value]) => `${key}:${value}`)
