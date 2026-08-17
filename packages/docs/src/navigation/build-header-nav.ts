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

const isCurrentHref = (
  itemHref: string,
  currentHref: string | undefined,
  localeCodes: string[],
) => {
  if (!currentHref || isExternalHref(itemHref)) {
    return false
  }

  if (itemHref === currentHref) {
    return true
  }

  if (itemHref === '/') {
    return false
  }

  if (currentHref.startsWith(`${itemHref}/`)) {
    return true
  }

  const itemSection = toSlugSegments(itemHref, localeCodes)[0]
  const currentSection = toSlugSegments(currentHref, localeCodes)[0]

  return Boolean(itemSection && itemSection === currentSection)
}

const toNavItem = ({
  currentHref,
  href,
  label,
  locale,
  source,
}: {
  currentHref?: string
  href: string
  label: string
  locale: string
  source: DocsSource
}): DocsThemeNavItem => {
  const resolvedHref = resolveNavHref(href, locale, source)

  return {
    href: resolvedHref,
    label,
    current: isCurrentHref(resolvedHref, currentHref, source.getLocaleCodes()),
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

  return items.map((item) =>
    toNavItem({
      currentHref,
      href: item.href,
      label: localizeLabel(item.label, locale, item.href),
      locale,
      source,
    }),
  )
}
