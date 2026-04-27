import { expectTypeOf, test } from 'vitest'

import type {
  SearchFilters,
  SearchIndexRecord,
  SearchIndexRecordsOptions,
  SearchIndexSiteOptions,
  SearchResultFilters,
  SearchResultItem,
} from '../src/index'

test('locale and filter contracts stay free-form strings', () => {
  expectTypeOf<SearchIndexRecord['locale']>().toEqualTypeOf<
    string | undefined
  >()
  expectTypeOf<SearchResultItem['locale']>().toEqualTypeOf<string | undefined>()
  expectTypeOf<SearchIndexSiteOptions>().toEqualTypeOf<{
    glob?: string
    output?: {
      path?: string
    }
    site: string
  }>()
  expectTypeOf<SearchFilters[string]>().toEqualTypeOf<string | undefined>()
  expectTypeOf<SearchResultFilters[string]>().toEqualTypeOf<
    string[] | undefined
  >()

  const filters = {
    audience: 'developer',
    locale: 'zh-TW',
    surface: 'docs',
  } satisfies SearchFilters

  const siteOptions = {
    output: {
      path: './public/pagefind',
    },
    site: './public',
  } satisfies SearchIndexSiteOptions

  const recordsOptions: SearchIndexRecordsOptions = {
    filters: {
      audience: 'developer',
    },
    locale: 'en-US',
    output: {
      path: './public/pagefind-records',
    },
    records: [
      {
        content: 'Search contracts stay UI-agnostic.',
        filters: {
          audience: 'developer',
          surface: 'docs',
        },
        id: 'search-contracts',
        language: 'en',
        locale: 'en-US',
        region: 'US',
        sort: {
          priority: 1,
        },
        title: 'Search Contracts',
        url: '/reference/search-contracts',
      },
    ],
  }

  expectTypeOf(filters).toMatchTypeOf<SearchFilters>()
  expectTypeOf(recordsOptions).toMatchTypeOf<SearchIndexRecordsOptions>()
  expectTypeOf(siteOptions).toMatchTypeOf<SearchIndexSiteOptions>()
})
