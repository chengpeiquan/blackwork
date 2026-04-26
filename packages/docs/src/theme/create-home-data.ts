import { defineConfig } from '../config/define-config'
import type {
  DocsHomeConfig,
  DocsThemeHomeAction,
  DocsThemeHomeData,
} from './types'
import type { DocsConfig, NormalizedDocsConfig } from '../config/types'
import type { DocsSource } from '../source/types'

export interface CreateHomeDataOptions {
  config?: DocsConfig | NormalizedDocsConfig
  locale: string
  source: DocsSource
}

type HomeRecord = DocsHomeConfig

interface ParsedHref {
  pathname: string
  suffix: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getString = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined
  }

  const normalizedValue = value.trim()
  return normalizedValue ? normalizedValue : undefined
}

const getOptionalString = (value: unknown) => {
  if (value === false) {
    return undefined
  }

  return getString(value)
}

const parseHref = (href: string): ParsedHref => {
  const suffixIndex = href.search(/[?#]/u)

  if (suffixIndex < 0) {
    return {
      pathname: href,
      suffix: '',
    }
  }

  return {
    pathname: href.slice(0, suffixIndex),
    suffix: href.slice(suffixIndex),
  }
}

const getPathLocale = (
  pathname: string,
  source: DocsSource,
): string | undefined => {
  const [, locale] = pathname.match(/^\/([^/]+)(?:\/|$)/u) ?? []

  return source.getLocaleCodes().find((code) => code === locale)
}

const localizeHomeHref = (href: string, locale: string, source: DocsSource) => {
  if (!href.startsWith('/') || href.startsWith('//')) {
    return href
  }

  const { pathname, suffix } = parseHref(href)

  if (getPathLocale(pathname, source)) {
    return href
  }

  const defaultLocale = source.getDefaultLocale()
  const matchedEntry = defaultLocale
    ? source.getEntries(defaultLocale).find((item) => item.href === pathname)
    : source
        .getLocaleCodes()
        .flatMap((code) => source.getEntries(code))
        .find((item) => item.href === pathname)

  if (!matchedEntry) {
    return href
  }

  const localizedEntry = source.getEntry(locale, matchedEntry.slugSegments)

  if (!localizedEntry) {
    return href
  }

  return `${localizedEntry.href}${suffix}`
}

const getAction = (
  value: unknown,
  locale: string,
  source: DocsSource,
): DocsThemeHomeAction | undefined => {
  if (!isRecord(value)) {
    return undefined
  }

  const href = getString(value.href)
  const label = getString(value.label)

  if (!href || !label) {
    return undefined
  }

  return {
    href: localizeHomeHref(href, locale, source),
    label,
  }
}

const getConfiguredHighlights = (
  value: unknown,
  locale: string,
  source: DocsSource,
): DocsThemeHomeData['highlights'] | undefined => {
  if (value === false) {
    return []
  }

  if (!Array.isArray(value)) {
    return undefined
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return []
    }

    const href = getString(item.href)
    const title = getString(item.title)
    const description = getString(item.description)

    return href && title && description
      ? [
          {
            href: localizeHomeHref(href, locale, source),
            title,
            description,
          },
        ]
      : []
  })
}

const getSiteTitle = (config: NormalizedDocsConfig) =>
  config.site.title || 'Documentation'

const createAutoHomeData = (
  config: NormalizedDocsConfig,
  locale: string,
  source: DocsSource,
): DocsThemeHomeData => {
  const entries = source.getEntries(locale)
  const homeHref = source.getCanonicalHref(locale, [])
  const landingEntry = source.getEntry(locale, []) ?? entries[0]
  const secondaryEntry = entries.find(
    (entry) => entry.href !== landingEntry?.href,
  )
  const description =
    config.site.description ||
    landingEntry?.description ||
    'Browse the available documentation.'

  return {
    mode: 'auto',
    badge: `${entries.length} page${entries.length === 1 ? '' : 's'}`,
    eyebrow: landingEntry?.title || 'Documentation',
    title: getSiteTitle(config),
    description,
    homeHref,
    primaryAction: {
      href: landingEntry?.href ?? homeHref,
      label: landingEntry ? `Read ${landingEntry.title}` : 'Browse docs',
    },
    ...(secondaryEntry
      ? {
          secondaryAction: {
            href: secondaryEntry.href,
            label: secondaryEntry.title,
          },
        }
      : {}),
    highlights: [],
  }
}

const hasConfiguredContent = (home: HomeRecord) => {
  return [
    home.badge,
    home.eyebrow,
    home.title,
    home.description,
    home.primaryAction,
    home.secondaryAction,
    home.highlights,
  ].some((value) => value !== undefined)
}

export function createHomeData({
  config,
  locale,
  source,
}: CreateHomeDataOptions): DocsThemeHomeData {
  const normalizedConfig = defineConfig(config)
  const auto = createAutoHomeData(normalizedConfig, locale, source)

  if (!hasConfiguredContent(normalizedConfig.home)) {
    return auto
  }

  return {
    ...auto,
    mode: 'configured',
    badge: getOptionalString(normalizedConfig.home.badge),
    eyebrow: getOptionalString(normalizedConfig.home.eyebrow),
    title: getString(normalizedConfig.home.title) || auto.title,
    description:
      getString(normalizedConfig.home.description) || auto.description,
    primaryAction:
      getAction(normalizedConfig.home.primaryAction, locale, source) ||
      auto.primaryAction,
    secondaryAction:
      getAction(normalizedConfig.home.secondaryAction, locale, source) ||
      auto.secondaryAction,
    highlights:
      getConfiguredHighlights(
        normalizedConfig.home.highlights,
        locale,
        source,
      ) ?? [],
  }
}
