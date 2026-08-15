import { loadPagefindBrowser } from './pagefind-browser-loader'
import type {
  PagefindBrowserModule,
  PagefindBrowserResultData,
} from './pagefind-browser-loader'
import type {
  SearchClient,
  SearchClientOptions,
  SearchClientQueryOptions,
  SearchClientResultItem,
  SearchClientSearchResult,
  SearchClientSubResult,
} from './types'

const trimTrailingSlashes = (value: string): string =>
  value.replace(/\/+$/u, '')

const destroyedDuringInitializationMessage =
  '[blackwork-search] Search client was destroyed before initialization completed.'

const resolveBundlePath = (options: SearchClientOptions): string => {
  if (options.bundlePath) {
    return trimTrailingSlashes(options.bundlePath)
  }

  const basePath = trimTrailingSlashes(options.basePath ?? '')

  return basePath ? `${basePath}/pagefind` : '/pagefind'
}

const resolveModulePath = (bundlePath: string): string =>
  `${bundlePath}/pagefind.js`

const normalizeBasePath = (
  basePath: string | undefined,
): string | undefined => {
  if (!basePath) {
    return undefined
  }

  const trimmed = trimTrailingSlashes(basePath)

  return trimmed || undefined
}

const normalizeUrl = (
  url: string | undefined,
  basePath: string | undefined,
): string | undefined => {
  if (!url || !basePath || !url.startsWith('/')) {
    return url
  }

  const nextCharacter = url.charAt(basePath.length)
  const alreadyPrefixed =
    url === basePath ||
    (url.startsWith(basePath) && ['#', '/', '?', ''].includes(nextCharacter))

  if (alreadyPrefixed) {
    return url
  }

  return `${basePath}${url}`
}

const normalizeSubResults = (
  subResults: PagefindBrowserResultData['sub_results'],
  basePath: string | undefined,
): SearchClientSubResult[] =>
  (subResults ?? []).map((item) => ({
    anchor: item.anchor,
    excerpt: item.excerpt,
    title: item.title,
    url: normalizeUrl(item.url, basePath) ?? item.url,
  }))

const normalizeResultItem = async (
  item: {
    data(): Promise<PagefindBrowserResultData>
    id: string
  },
  basePath: string | undefined,
): Promise<SearchClientResultItem> => {
  const data = await item.data()
  const meta = data.meta ?? {}

  return {
    excerpt: data.excerpt,
    filters: data.filters,
    id: item.id,
    meta,
    rawUrl: normalizeUrl(data.raw_url, basePath),
    subResults: normalizeSubResults(data.sub_results, basePath),
    title: meta.title,
    url: normalizeUrl(data.url, basePath) ?? data.url,
  }
}

export const createSearchClient = (
  options: SearchClientOptions = {},
): SearchClient => {
  const bundlePath = resolveBundlePath(options)
  const basePath = normalizeBasePath(options.basePath)
  const modulePath = resolveModulePath(bundlePath)
  let module: PagefindBrowserModule | undefined
  let initialization: Promise<PagefindBrowserModule> | undefined
  let lifecycleVersion = 0

  const ensureInitialized = async (): Promise<PagefindBrowserModule> => {
    if (module && !initialization) {
      return module
    }

    if (!initialization) {
      const version = lifecycleVersion

      initialization = (async () => {
        const browser = await loadPagefindBrowser(modulePath)

        try {
          await browser.options({
            bundlePath,
          })
          await browser.init()

          if (version !== lifecycleVersion) {
            await browser.destroy()
            throw new Error(destroyedDuringInitializationMessage)
          }

          module = browser

          return browser
        } catch (error) {
          if (version === lifecycleVersion) {
            module = undefined
          }
          throw error
        }
      })()
    }

    const activeInitialization = initialization

    try {
      return await activeInitialization
    } finally {
      if (initialization === activeInitialization) {
        initialization = undefined
      }
    }
  }

  return {
    async destroy() {
      lifecycleVersion += 1

      const activeModule = module
      const activeInitialization = initialization

      module = undefined
      initialization = undefined

      if (activeModule) {
        await activeModule.destroy()
        return
      }

      if (activeInitialization) {
        try {
          await activeInitialization
        } catch {
          // The next search will reinitialize if this attempt failed.
        }
      }
    },
    async preload(term: string, searchOptions?: SearchClientQueryOptions) {
      const browser = await ensureInitialized()

      await browser.preload(term, searchOptions)
    },
    async search(
      term: string,
      searchOptions?: SearchClientQueryOptions,
    ): Promise<SearchClientSearchResult> {
      const browser = await ensureInitialized()
      const result = await browser.search(term, searchOptions)
      const items = await Promise.all(
        result.results.map(async (item) => normalizeResultItem(item, basePath)),
      )

      return {
        items,
        total: items.length,
      }
    },
  }
}
