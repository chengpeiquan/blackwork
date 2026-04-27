import type { SearchClientQueryOptions } from './types'

export interface PagefindBrowserSubResultData {
  anchor?: string
  excerpt?: string
  title?: string
  url: string
}

export interface PagefindBrowserResultData {
  excerpt?: string
  filters?: Record<string, string[]>
  meta?: Record<string, string>
  raw_url?: string
  sub_results?: PagefindBrowserSubResultData[]
  url: string
}

export interface PagefindBrowserSearchHandle {
  data(): Promise<PagefindBrowserResultData>
  id: string
}

export interface PagefindBrowserSearchResponse {
  results: PagefindBrowserSearchHandle[]
}

export interface PagefindBrowserModule {
  destroy(): Promise<void>
  init(): Promise<void>
  options(options: { bundlePath: string }): Promise<void> | void
  preload(term: string, options?: SearchClientQueryOptions): Promise<void>
  search(
    term: string,
    options?: SearchClientQueryOptions,
  ): Promise<PagefindBrowserSearchResponse>
}

const importPagefindBrowserModule = new Function(
  'modulePath',
  'return import(modulePath)',
) as (modulePath: string) => Promise<unknown>

export const loadPagefindBrowser = async (
  modulePath: string,
): Promise<PagefindBrowserModule> =>
  (await importPagefindBrowserModule(
    modulePath,
  )) as unknown as PagefindBrowserModule
