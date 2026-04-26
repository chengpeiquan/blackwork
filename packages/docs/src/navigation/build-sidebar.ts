import { flattenResolvedSidebarItems, resolveSidebar } from './resolve-sidebar'
import type { DocsConfig, NormalizedDocsConfig } from '../config/types'
import type { DocEntry } from '../source/types'

export interface DocsSidebarItem {
  depth: number
  href: string
  slugSegments: string[]
  title: string
  parentHref?: string
  isActive: boolean
  isExternal?: boolean
}

export interface BuildSidebarOptions {
  config?: DocsConfig | NormalizedDocsConfig
  entries: DocEntry[]
  currentHref?: string
  sectionKey?: string
}

export function buildSidebar({
  config,
  entries,
  currentHref,
  sectionKey,
}: BuildSidebarOptions): DocsSidebarItem[] {
  return flattenResolvedSidebarItems(
    resolveSidebar({
      config,
      entries,
      currentHref,
      sectionKey,
    }),
  ).map((item) => ({
    depth: item.depth,
    href: item.href,
    slugSegments: [...item.slugSegments],
    title: item.title,
    ...(item.parentHref ? { parentHref: item.parentHref } : {}),
    isActive: item.isActive,
    ...(item.isExternal ? { isExternal: true } : {}),
  }))
}
