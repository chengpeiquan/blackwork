import type {
  DocsConfig,
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
