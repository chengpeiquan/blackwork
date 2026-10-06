import type {
  DocsConfig,
  DocsSidebarLabel,
  DocsThemeNavItemConfig,
  NormalizedDocsConfig,
} from '../config/types'
import type { DocsSource } from '../source/types'
import type { DocsThemeNavItem } from '../theme/types'

export interface BuildHeaderNavOptions {
  config?: DocsConfig | NormalizedDocsConfig
  currentHref?: string
  locale: string
  source: DocsSource
}

const isExternalHref = (href: string) => /^(https?:|mailto:|tel:)/u.test(href)

const titleCase = (value: string) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value

const localizeLabel = (
  value: DocsSidebarLabel | undefined,
  locale: string,
  fallback: string,
) => {
  if (typeof value === 'string') {
    return value
  }

  return value?.[locale] ?? fallback
}

const toSlugSegments = (href: string, localeCodes: string[]) => {
  const segments = href.split('/').filter(Boolean)

  if (segments[0] && localeCodes.includes(segments[0])) {
    return segments.slice(1)
  }

  return segments
}

const resolveNavHref = (href: string, locale: string, source: DocsSource) => {
  if (isExternalHref(href)) {
    return href
  }

  return source.getCanonicalHref(
    locale,
    toSlugSegments(href, source.getLocaleCodes()),
  )
}

const getCurrentNavIndex = (
  items: DocsThemeNavItem[],
  currentHref: string | undefined,
  localeCodes: string[],
) => {
  if (!currentHref) {
    return -1
  }

  const currentSegments = toSlugSegments(currentHref, localeCodes)
  let currentIndex = -1
  let longestMatch = -1
  let sectionFallback = -1

  items.forEach((item, index) => {
    if (isExternalHref(item.href)) {
      return
    }

    const segments = toSlugSegments(item.href, localeCodes)
    if (
      sectionFallback === -1 &&
      segments[0] &&
      segments[0] === currentSegments[0]
    ) {
      sectionFallback = index
    }

    const matches =
      segments.length === 0
        ? currentSegments.length === 0
        : segments.length <= currentSegments.length &&
          segments.every(
            (segment, segmentIndex) =>
              segment === currentSegments[segmentIndex],
          )

    if (matches && segments.length > longestMatch) {
      currentIndex = index
      longestMatch = segments.length
    }
  })

  // Overlapping section links must share one active item, with the deepest route winning.
  // A section without a matching route keeps its first navigation entry active.
  return currentIndex === -1 ? sectionFallback : currentIndex
}

const toNavItem = ({
  href,
  label,
  locale,
  source,
}: {
  href: string
  label: string
  locale: string
  source: DocsSource
}): DocsThemeNavItem => {
  const resolvedHref = resolveNavHref(href, locale, source)

  return {
    href: resolvedHref,
    label,
    current: false,
  }
}

const buildAutoNavItems = (
  config: DocsConfig | NormalizedDocsConfig,
): DocsThemeNavItemConfig[] => {
  return Object.entries(config.content?.sections ?? {}).map(
    ([sectionKey, section]) => ({
      href: `/${sectionKey}`,
      label: section.label ?? titleCase(sectionKey),
    }),
  )
}

export const buildHeaderNavigation = ({
  config = {},
  currentHref,
  locale,
  source,
}: BuildHeaderNavOptions): DocsThemeNavItem[] => {
  if (config.theme?.nav === false) {
    return []
  }

  const items = Array.isArray(config.theme?.nav)
    ? config.theme.nav
    : buildAutoNavItems(config)

  const navigation = items.map((item) =>
    toNavItem({
      href: item.href,
      label: localizeLabel(item.label, locale, item.href),
      locale,
      source,
    }),
  )
  const currentIndex = getCurrentNavIndex(
    navigation,
    currentHref,
    source.getLocaleCodes(),
  )

  return navigation.map((item, index) => ({
    ...item,
    current: index === currentIndex,
  }))
}
