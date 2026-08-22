import { relative, resolve, sep } from 'node:path'

import { beforeEach, describe, expect, test, vi } from 'vitest'

const { addCustomRecord, close, createIndex, loadPagefind, writeFiles } =
  vi.hoisted(() => {
    const addCustomRecord = vi.fn(async () => ({
      errors: ['warn: duplicate record'],
      file: {
        meta: {
          title: 'Taiwan Guide',
        },
        uniqueWords: 12,
        url: '/guides/taiwan',
      },
    }))
    const writeFiles = vi.fn(async () => ({
      errors: ['warn: existing bundle replaced'],
      outputPath: './fixtures/pagefind-records',
    }))
    const createIndex = vi.fn<
      () => Promise<{
        errors: string[]
        index?: {
          addCustomRecord: typeof addCustomRecord
          writeFiles: typeof writeFiles
        }
      }>
    >(async () => ({
      errors: [],
      index: {
        addCustomRecord,
        writeFiles,
      },
    }))
    const close = vi.fn(async () => undefined)
    const loadPagefind = vi.fn(async () => ({
      close,
      createIndex,
    }))

    return {
      addCustomRecord,
      close,
      createIndex,
      loadPagefind,
      writeFiles,
    }
  })

vi.mock('../src/pagefind-loader', () => ({
  loadPagefind,
}))

import { indexRecords } from '../src/index'

describe('indexRecords', () => {
  beforeEach(() => {
    addCustomRecord.mockClear()
    close.mockClear()
    createIndex.mockClear()
    loadPagefind.mockClear()
    writeFiles.mockClear()

    createIndex.mockResolvedValue({
      errors: [],
      index: {
        addCustomRecord,
        writeFiles,
      },
    })
  })

  test('serializes filters and derives language and region from locale', async () => {
    const outputPath = resolve(process.cwd(), 'fixtures/pagefind-records')
    const outputRelativePath = relative(process.cwd(), outputPath)
      .split(sep)
      .join('/')

    const result = await indexRecords({
      output: {
        path: './fixtures/pagefind-records',
      },
      records: [
        {
          content: 'A guide to Taiwan.',
          filters: {
            audience: 'developer',
            topic: 'travel',
          },
          id: 'taiwan-guide',
          locale: 'zh-TW',
          metadata: {
            category: 'guide',
          },
          sort: {
            priority: 2,
          },
          summary: 'Travel notes for Taiwan.',
          title: 'Taiwan Guide',
          url: '/guides/taiwan',
        },
      ],
    })

    expect(addCustomRecord).toHaveBeenCalledWith({
      content: 'A guide to Taiwan.',
      filters: {
        audience: ['developer'],
        language: ['zh'],
        locale: ['zh-TW'],
        region: ['TW'],
        topic: ['travel'],
      },
      language: 'zh',
      meta: {
        category: 'guide',
        id: 'taiwan-guide',
        language: 'zh',
        locale: 'zh-TW',
        region: 'TW',
        summary: 'Travel notes for Taiwan.',
        title: 'Taiwan Guide',
      },
      sort: {
        priority: '2',
      },
      url: '/guides/taiwan',
    })
    expect(writeFiles).toHaveBeenCalledWith({
      outputPath,
    })
    expect(result).toEqual({
      indexingErrors: ['warn: duplicate record'],
      outputPath,
      outputRelativePath,
      recordCount: 1,
      writeErrors: ['warn: existing bundle replaced'],
      writeOutputPath: outputPath,
    })
  })

  test('omits nullish metadata and sort values', async () => {
    await indexRecords({
      records: [
        {
          content: 'A record with optional values.',
          id: 'optional-values',
          language: 'en',
          metadata: {
            category: 'guide',
            nullable: null,
            optional: undefined,
          },
          sort: {
            nullable: null,
            optional: undefined,
            priority: 1,
          },
          title: 'Optional Values',
          url: '/guides/optional-values',
        },
      ],
    })

    expect(addCustomRecord).toHaveBeenCalledWith({
      content: 'A record with optional values.',
      filters: {
        language: ['en'],
      },
      language: 'en',
      meta: {
        category: 'guide',
        id: 'optional-values',
        language: 'en',
        title: 'Optional Values',
      },
      sort: {
        priority: '1',
      },
      url: '/guides/optional-values',
    })
  })

  test('derives region from the locale tail when a script subtag is present', async () => {
    await indexRecords({
      records: [
        {
          content: 'Traditional Chinese for Taiwan.',
          id: 'taiwan-script-locale',
          locale: 'zh-Hant-TW',
          title: 'Traditional Taiwan',
          url: '/guides/traditional-taiwan',
        },
      ],
    })

    expect(addCustomRecord).toHaveBeenCalledWith({
      content: 'Traditional Chinese for Taiwan.',
      filters: {
        language: ['zh'],
        locale: ['zh-Hant-TW'],
        region: ['TW'],
      },
      language: 'zh',
      meta: {
        id: 'taiwan-script-locale',
        language: 'zh',
        locale: 'zh-Hant-TW',
        region: 'TW',
        title: 'Traditional Taiwan',
      },
      sort: undefined,
      url: '/guides/traditional-taiwan',
    })
  })

  test('finds the first region-like subtag when variants follow it', async () => {
    await indexRecords({
      records: [
        {
          content: 'Swiss German orthography.',
          id: 'swiss-german-variant',
          locale: 'de-CH-1901',
          title: 'Swiss German Variant',
          url: '/guides/swiss-german-variant',
        },
      ],
    })

    expect(addCustomRecord).toHaveBeenCalledWith({
      content: 'Swiss German orthography.',
      filters: {
        language: ['de'],
        locale: ['de-CH-1901'],
        region: ['CH'],
      },
      language: 'de',
      meta: {
        id: 'swiss-german-variant',
        language: 'de',
        locale: 'de-CH-1901',
        region: 'CH',
        title: 'Swiss German Variant',
      },
      sort: undefined,
      url: '/guides/swiss-german-variant',
    })
  })

  test('does not invent a region when the locale has no derivable region', async () => {
    await indexRecords({
      records: [
        {
          content: 'Traditional Chinese without a region.',
          id: 'script-only-locale',
          locale: 'zh-Hant',
          title: 'Traditional Chinese',
          url: '/guides/traditional-chinese',
        },
      ],
    })

    expect(addCustomRecord).toHaveBeenCalledWith({
      content: 'Traditional Chinese without a region.',
      filters: {
        language: ['zh'],
        locale: ['zh-Hant'],
      },
      language: 'zh',
      meta: {
        id: 'script-only-locale',
        language: 'zh',
        locale: 'zh-Hant',
        title: 'Traditional Chinese',
      },
      sort: undefined,
      url: '/guides/traditional-chinese',
    })
  })

  test('fails when language cannot be derived from the record locale family', async () => {
    await expect(
      indexRecords({
        records: [
          {
            content: 'Missing locale and language.',
            id: 'missing-language',
            title: 'Missing Language',
            url: '/broken',
          },
        ],
      }),
    ).rejects.toThrow(
      '[blackwork-search] Record "missing-language" must define "language" or a derivable "locale".',
    )

    expect(addCustomRecord).not.toHaveBeenCalled()
    expect(writeFiles).not.toHaveBeenCalled()
    expect(close).toHaveBeenCalledTimes(1)
  })

  test('applies top-level locale and filters as defaults for records', async () => {
    await indexRecords({
      filters: {
        audience: 'developer',
        section: 'guides',
      },
      locale: 'en-US',
      records: [
        {
          content: 'United States guide.',
          filters: {
            audience: 'operator',
          },
          id: 'us-guide',
          title: 'US Guide',
          url: '/guides/us',
        },
      ],
    })

    expect(addCustomRecord).toHaveBeenCalledWith({
      content: 'United States guide.',
      filters: {
        audience: ['operator'],
        language: ['en'],
        locale: ['en-US'],
        region: ['US'],
        section: ['guides'],
      },
      language: 'en',
      meta: {
        id: 'us-guide',
        language: 'en',
        locale: 'en-US',
        region: 'US',
        title: 'US Guide',
      },
      sort: undefined,
      url: '/guides/us',
    })
  })

  test('accepts mixed-case explicit language and region when they match the locale family', async () => {
    await indexRecords({
      records: [
        {
          content: 'Case-insensitive locale family.',
          id: 'case-insensitive-family',
          language: 'EN',
          locale: 'en-US',
          region: 'us',
          title: 'Case Insensitive Family',
          url: '/guides/case-insensitive-family',
        },
      ],
    })

    expect(addCustomRecord).toHaveBeenCalledWith({
      content: 'Case-insensitive locale family.',
      filters: {
        language: ['en'],
        locale: ['en-US'],
        region: ['US'],
      },
      language: 'en',
      meta: {
        id: 'case-insensitive-family',
        language: 'en',
        locale: 'en-US',
        region: 'US',
        title: 'Case Insensitive Family',
      },
      sort: undefined,
      url: '/guides/case-insensitive-family',
    })
  })

  test('keeps top-level defaults when record overrides are only whitespace', async () => {
    await indexRecords({
      filters: {
        audience: 'developer',
        section: 'guides',
      },
      locale: 'en-US',
      records: [
        {
          content: 'Whitespace overrides should not clear defaults.',
          filters: {
            audience: ' ',
          },
          id: 'whitespace-defaults',
          locale: '   ',
          title: 'Whitespace Defaults',
          url: '/guides/whitespace-defaults',
        },
      ],
    })

    expect(addCustomRecord).toHaveBeenCalledWith({
      content: 'Whitespace overrides should not clear defaults.',
      filters: {
        audience: ['developer'],
        language: ['en'],
        locale: ['en-US'],
        region: ['US'],
        section: ['guides'],
      },
      language: 'en',
      meta: {
        id: 'whitespace-defaults',
        language: 'en',
        locale: 'en-US',
        region: 'US',
        title: 'Whitespace Defaults',
      },
      sort: undefined,
      url: '/guides/whitespace-defaults',
    })
  })

  test('fails when explicit language conflicts with the locale family', async () => {
    await expect(
      indexRecords({
        records: [
          {
            content: 'Locale conflict.',
            id: 'locale-conflict',
            language: 'fr',
            locale: 'en-US',
            title: 'Locale Conflict',
            url: '/broken/conflict',
          },
        ],
      }),
    ).rejects.toThrow(
      '[blackwork-search] Record "locale-conflict" has language "fr" that conflicts with locale "en-US".',
    )

    expect(addCustomRecord).not.toHaveBeenCalled()
    expect(writeFiles).not.toHaveBeenCalled()
    expect(close).toHaveBeenCalledTimes(1)
  })

  test('fails when explicit region conflicts with the locale family', async () => {
    await expect(
      indexRecords({
        records: [
          {
            content: 'Region conflict.',
            id: 'region-conflict',
            locale: 'en-US',
            region: 'CA',
            title: 'Region Conflict',
            url: '/broken/region-conflict',
          },
        ],
      }),
    ).rejects.toThrow(
      '[blackwork-search] Record "region-conflict" has region "CA" that conflicts with locale "en-US".',
    )

    expect(addCustomRecord).not.toHaveBeenCalled()
    expect(writeFiles).not.toHaveBeenCalled()
    expect(close).toHaveBeenCalledTimes(1)
  })
})
