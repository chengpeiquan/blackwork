import {
  flattenResolvedSidebarItems,
  type DocsResolvedSidebarNode,
} from './resolve-sidebar'
import type { DocEntry } from '../source/types'

export interface DocsPagerLink {
  href: string
  title: string
}

export interface DocsPager {
  previous: DocsPagerLink | null
  next: DocsPagerLink | null
}

export interface BuildPagerOptions {
  entries: DocEntry[]
  currentHref: string
  sidebar?: DocsResolvedSidebarNode[]
}

const toPagerLink = (
  entry:
    | DocEntry
    | (ReturnType<typeof flattenResolvedSidebarItems>[number] & {
        isExternal: boolean
      })
    | undefined,
): DocsPagerLink | null => {
  if (!entry) {
    return null
  }

  return {
    href: entry.href,
    title: entry.title,
  }
}

export function buildPager({
  entries,
  currentHref,
  sidebar,
}: BuildPagerOptions): DocsPager {
  const pagerEntries = sidebar
    ? flattenResolvedSidebarItems(sidebar).filter((item) => !item.isExternal)
    : entries
  const currentIndex = pagerEntries.findIndex(
    (entry) => entry.href === currentHref,
  )

  if (currentIndex < 0) {
    return {
      previous: null,
      next: null,
    }
  }

  return {
    previous: toPagerLink(pagerEntries[currentIndex - 1]),
    next: toPagerLink(pagerEntries[currentIndex + 1]),
  }
}
