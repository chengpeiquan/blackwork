import { defineConfig } from '../config/define-config'
import type {
  DocsConfig,
  DocsLocaleDefinition,
  NormalizedDocsConfig,
} from '../config/types'
import type { DocEntry, DocsSource } from '../source/types'

export interface DocsLocaleLink {
  locale: string
  href: string
  label?: string
  lang?: string
  current: boolean
}

export interface BuildLocaleLinksOptions {
  config?: DocsConfig | NormalizedDocsConfig
  entry: DocEntry
  source: DocsSource
}

const getLocaleDefinition = (
  config: NormalizedDocsConfig,
  locale: string,
): DocsLocaleDefinition | undefined => {
  const localeEntries = Object.entries(config.content.locales ?? {})
  const directMatch = config.content.locales?.[locale]

  if (directMatch) {
    return directMatch
  }

  const matchedEntry = localeEntries.find(
    ([key, value]) => key === locale || value.code === locale,
  )

  return matchedEntry?.[1]
}

export function buildLocaleLinks({
  config,
  entry,
  source,
}: BuildLocaleLinksOptions): DocsLocaleLink[] {
  const normalizedConfig = defineConfig(config)

  return source.getLocaleCodes().flatMap((locale) => {
    const localizedEntry = source.getEntry(locale, entry.slugSegments)

    if (!localizedEntry) {
      return []
    }

    const localeDefinition = getLocaleDefinition(normalizedConfig, locale)

    return {
      locale,
      href: localizedEntry.href,
      label: localeDefinition?.label,
      lang: localeDefinition?.lang,
      current: locale === entry.locale,
    }
  })
}
