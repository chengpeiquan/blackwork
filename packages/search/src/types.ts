type SearchMetadataValue = boolean | number | string | null
type SearchSortValue = boolean | number | string

export interface SearchFilters {
  [key: string]: string | undefined
}

export interface SearchClientOptions {
  basePath?: string
  bundlePath?: string
}

export interface SearchClientQueryOptions {
  filters?: Record<string, string | string[]>
}

export interface SearchClientSubResult {
  anchor?: string
  excerpt?: string
  title?: string
  url: string
}

export interface SearchClientResultItem {
  excerpt?: string
  filters?: SearchResultFilters
  id: string
  meta: Record<string, string>
  rawUrl?: string
  subResults: SearchClientSubResult[]
  title?: string
  url: string
}

export interface SearchClientSearchResult {
  items: SearchClientResultItem[]
  total: number
}

export interface SearchClient {
  destroy(): Promise<void>
  preload(term: string, options?: SearchClientQueryOptions): Promise<void>
  search(
    term: string,
    options?: SearchClientQueryOptions,
  ): Promise<SearchClientSearchResult>
}

interface SearchFilterableDocument {
  locale?: string
  filters?: SearchFilters
}

export interface SearchIndexOutputOptions {
  path?: string
}

export interface SearchIndexSiteOptions {
  glob?: string
  output?: SearchIndexOutputOptions
  site: string
}

export interface SearchIndexSiteResult {
  glob?: string
  indexingErrors: string[]
  outputPath: string
  pageCount: number
  sitePath: string
  siteRelativeOutputPath: string
  writeErrors: string[]
  writeOutputPath: string
}

export interface SearchIndexRecord extends SearchFilterableDocument {
  id: string
  content: string
  language?: string
  metadata?: Record<string, SearchMetadataValue>
  region?: string
  sort?: Record<string, SearchSortValue>
  summary?: string
  title: string
  url: string
}

export interface SearchIndexRecordsOptions extends SearchFilterableDocument {
  output?: SearchIndexOutputOptions
  records: SearchIndexRecord[]
}

export interface SearchIndexRecordsResult {
  indexingErrors: string[]
  outputPath: string
  outputRelativePath: string
  recordCount: number
  writeErrors: string[]
  writeOutputPath: string
}

export interface SearchResultFilters {
  [key: string]: string[] | undefined
}

export type SearchSortDirection = 'asc' | 'desc'

export interface SearchSort {
  field: string
  direction?: SearchSortDirection
}

export interface SearchResultItem extends SearchFilterableDocument {
  id: string
  metadata?: Record<string, SearchMetadataValue>
  score?: number
  summary?: string
  title: string
  url: string
}

export interface SearchResults {
  items: SearchResultItem[]
  total: number
  filters?: SearchResultFilters
  appliedFilters?: SearchFilters
  sort?: SearchSort
}
