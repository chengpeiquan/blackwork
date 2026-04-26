import type { DocEntry, DocsManifest, DocsSource } from './types'

export const sortDocEntries = (entries: DocEntry[]) => {
  return [...entries].sort((left, right) => {
    const leftOrder = left.order ?? Number.POSITIVE_INFINITY
    const rightOrder = right.order ?? Number.POSITIVE_INFINITY

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder
    }

    return left.href.localeCompare(right.href)
  })
}

const createCanonicalHref = (
  locale: string,
  slugSegments: string[] = [],
  defaultLocale?: string,
) => {
  const suffix = slugSegments.join('/')

  if (locale === defaultLocale) {
    return suffix ? `/${suffix}` : '/'
  }

  return suffix ? `/${locale}/${suffix}` : `/${locale}`
}

const createLegacyAliasHref = ({
  defaultLocale,
  enableDefaultLocaleRedirect,
  locale,
  slugSegments = [],
}: {
  defaultLocale?: string
  enableDefaultLocaleRedirect: boolean
  locale: string
  slugSegments?: string[]
}) => {
  if (
    locale !== defaultLocale ||
    !defaultLocale ||
    !enableDefaultLocaleRedirect
  ) {
    return null
  }

  const suffix = slugSegments.join('/')
  return suffix ? `/${locale}/${suffix}` : `/${locale}`
}

export const buildDocsSource = ({
  defaultLocale,
  enableDefaultLocaleRedirect,
  entries,
  localeCodes,
}: DocsManifest): DocsSource => {
  const entriesByLocale = new Map<string, DocEntry[]>()

  for (const locale of localeCodes) {
    entriesByLocale.set(
      locale,
      sortDocEntries(entries.filter((entry) => entry.locale === locale)),
    )
  }

  const getEntries = (locale: string) => entriesByLocale.get(locale) ?? []

  return {
    getAliasEntries() {
      if (!defaultLocale) {
        return []
      }

      return getEntries(defaultLocale).filter(
        (entry): entry is DocEntry & { legacyHref: string } =>
          typeof entry.legacyHref === 'string' && entry.legacyHref.length > 0,
      )
    },
    getCanonicalHref(locale, slugSegments = []) {
      return createCanonicalHref(locale, slugSegments, defaultLocale)
    },
    getDefaultLocale() {
      return defaultLocale
    },
    getEntries,
    getEntry(locale, slugSegments = []) {
      const href = createCanonicalHref(locale, slugSegments, defaultLocale)
      return getEntries(locale).find((entry) => entry.href === href) ?? null
    },
    isDefaultLocaleRedirectEnabled() {
      return enableDefaultLocaleRedirect
    },
    getLegacyAliasHref(locale, slugSegments = []) {
      return createLegacyAliasHref({
        defaultLocale,
        enableDefaultLocaleRedirect,
        locale,
        slugSegments,
      })
    },
    getLocaleCodes() {
      return [...localeCodes]
    },
  }
}
