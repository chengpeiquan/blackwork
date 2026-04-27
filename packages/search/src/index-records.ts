import { relative, resolve, sep } from 'node:path'

import { loadPagefind } from './pagefind-loader'
import type {
  PagefindCustomRecord,
  PagefindNewFileResponse,
} from './pagefind-loader'
import type {
  SearchFilters,
  SearchIndexRecord,
  SearchIndexRecordsOptions,
  SearchIndexRecordsResult,
} from './types'

const normalizeRequiredPath = (value: string, label: string): string => {
  const normalized = value.trim()

  if (!normalized) {
    throw new TypeError(
      `[blackwork-search] "${label}" must be a non-empty string.`,
    )
  }

  return resolve(normalized)
}

const normalizeOutputPath = (outputPath: string | undefined): string => {
  if (outputPath == null) {
    return resolve('pagefind')
  }

  return normalizeRequiredPath(outputPath, 'output.path')
}

const normalizeRelativePath = (fromPath: string, toPath: string): string =>
  relative(fromPath, toPath).split(sep).join('/')

const getMissingIndexError = (errors: string[]): Error => {
  const suffix = errors.length > 0 ? `: ${errors.join('; ')}` : '.'

  return new Error(
    `[blackwork-search] Pagefind did not return an index${suffix}`,
  )
}

const normalizeText = (value: string | undefined): string | undefined => {
  if (value == null) {
    return undefined
  }

  const normalized = value.trim()

  return normalized || undefined
}

const normalizeLanguage = (value: string | undefined): string | undefined => {
  const normalized = normalizeText(value)

  return normalized?.toLowerCase()
}

const normalizeRegion = (value: string | undefined): string | undefined => {
  const normalized = normalizeText(value)

  return normalized?.toUpperCase()
}

const normalizeSearchFilters = (
  filters: SearchFilters | undefined,
): SearchFilters | undefined => {
  if (!filters) {
    return undefined
  }

  const normalized = Object.entries(filters).reduce<SearchFilters>(
    (result, [key, value]) => {
      const normalizedValue = normalizeText(value)

      if (!normalizedValue) {
        return result
      }

      result[key] = normalizedValue

      return result
    },
    {},
  )

  return Object.keys(normalized).length > 0 ? normalized : undefined
}

const deriveLocaleFamily = (
  record: SearchIndexRecord,
): { language: string; region?: string } => {
  const explicitLanguage = normalizeLanguage(record.language)
  const explicitRegion = normalizeRegion(record.region)
  const locale = normalizeText(record.locale)
  const localeParts =
    locale?.split(/[-_]/u).map((part) => normalizeText(part)) ?? []
  const derivedLanguage = normalizeLanguage(localeParts[0])
  const derivedRegion = localeParts
    .slice(1)
    .find((part) => part && /^(?:[A-Za-z]{2}|\d{3})$/u.test(part))
  const normalizedDerivedRegion = normalizeRegion(derivedRegion)

  if (
    explicitLanguage &&
    derivedLanguage &&
    explicitLanguage !== derivedLanguage
  ) {
    throw new Error(
      `[blackwork-search] Record "${record.id}" has language "${explicitLanguage}" that conflicts with locale "${locale}".`,
    )
  }

  if (
    explicitRegion &&
    normalizedDerivedRegion &&
    explicitRegion !== normalizedDerivedRegion
  ) {
    throw new Error(
      `[blackwork-search] Record "${record.id}" has region "${explicitRegion}" that conflicts with locale "${locale}".`,
    )
  }

  const language = explicitLanguage ?? derivedLanguage
  const region = explicitRegion ?? normalizedDerivedRegion

  if (!language) {
    throw new Error(
      `[blackwork-search] Record "${record.id}" must define "language" or a derivable "locale".`,
    )
  }

  return {
    language,
    region,
  }
}

const mergeFilters = (
  defaults: SearchFilters | undefined,
  overrides: SearchFilters | undefined,
): SearchFilters | undefined => {
  const normalizedDefaults = normalizeSearchFilters(defaults)
  const normalizedOverrides = normalizeSearchFilters(overrides)

  if (!normalizedDefaults && !normalizedOverrides) {
    return undefined
  }

  return {
    ...(normalizedDefaults ?? {}),
    ...(normalizedOverrides ?? {}),
  }
}

const applyRecordDefaults = (
  record: SearchIndexRecord,
  options: SearchIndexRecordsOptions,
): SearchIndexRecord => ({
  ...record,
  filters: mergeFilters(options.filters, record.filters),
  locale: normalizeText(record.locale) ?? normalizeText(options.locale),
})

const toStringRecord = (
  values: Record<string, boolean | number | string | null> | undefined,
): Record<string, string> | undefined => {
  if (!values) {
    return undefined
  }

  const serialized = Object.entries(values).reduce<Record<string, string>>(
    (result, [key, value]) => {
      if (value == null) {
        return result
      }

      result[key] = String(value)

      return result
    },
    {},
  )

  return Object.keys(serialized).length > 0 ? serialized : undefined
}

const toFilterRecord = (
  filters: SearchFilters | undefined,
): Record<string, string[]> | undefined => {
  if (!filters) {
    return undefined
  }

  const serialized = Object.entries(filters).reduce<Record<string, string[]>>(
    (result, [key, value]) => {
      const normalized = normalizeText(value)

      if (!normalized) {
        return result
      }

      result[key] = [normalized]

      return result
    },
    {},
  )

  return Object.keys(serialized).length > 0 ? serialized : undefined
}

const withDerivedFilters = (
  filters: Record<string, string[]> | undefined,
  derived: {
    language: string
    locale?: string
    region?: string
  },
): Record<string, string[]> => {
  const result = {
    ...(filters ?? {}),
  }

  if (derived.locale) {
    result.locale = [derived.locale]
  }

  result.language = [derived.language]

  if (derived.region) {
    result.region = [derived.region]
  }

  return result
}

const toPagefindRecord = (record: SearchIndexRecord): PagefindCustomRecord => {
  const locale = normalizeText(record.locale)
  const { language, region } = deriveLocaleFamily(record)
  const metadata: Record<string, string> = {
    ...(toStringRecord(record.metadata) ?? {}),
    id: record.id,
    language,
    title: record.title,
  }

  if (locale) {
    metadata.locale = locale
  }

  if (region) {
    metadata.region = region
  }

  if (record.summary) {
    metadata.summary = record.summary
  }

  const filters = withDerivedFilters(toFilterRecord(record.filters), {
    language,
    locale,
    region,
  })

  return {
    content: record.content,
    filters,
    language,
    meta: metadata,
    sort: toStringRecord(record.sort),
    url: record.url,
  }
}

const collectIndexingErrors = (
  responses: PagefindNewFileResponse[],
): string[] => responses.flatMap((response) => response.errors)

export const indexRecords = async (
  options: SearchIndexRecordsOptions,
): Promise<SearchIndexRecordsResult> => {
  const outputPath = normalizeOutputPath(options.output?.path)
  const outputRelativePath = normalizeRelativePath(process.cwd(), outputPath)
  const pagefind = await loadPagefind()

  try {
    const { errors, index } = await pagefind.createIndex()

    if (!index) {
      throw getMissingIndexError(errors)
    }

    const responses = await Promise.all(
      options.records.map(async (record) =>
        index.addCustomRecord(
          toPagefindRecord(applyRecordDefaults(record, options)),
        ),
      ),
    )
    const writeSummary = await index.writeFiles({
      outputPath,
    })
    const writeOutputPath = normalizeRequiredPath(
      writeSummary.outputPath,
      'write.outputPath',
    )

    return {
      indexingErrors: collectIndexingErrors(responses),
      outputPath,
      outputRelativePath,
      recordCount: options.records.length,
      writeErrors: writeSummary.errors,
      writeOutputPath,
    }
  } finally {
    await pagefind.close()
  }
}
