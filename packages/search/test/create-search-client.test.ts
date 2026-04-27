import { beforeEach, describe, expect, test, vi } from 'vitest'

const events: string[] = []

const { destroy, init, loadPagefindBrowser, options, preload, search } =
  vi.hoisted(() => {
    const options = vi.fn(async (_options: { bundlePath: string }) => {
      events.push('options')
    })
    const init = vi.fn(async () => {
      events.push('init')
    })
    const preload = vi.fn(async (_term: string, _options?: unknown) => {
      events.push('preload')
    })
    const search = vi.fn(async (_term: string, _options?: unknown) => {
      events.push('search')

      return {
        results: [
          {
            data: async () => ({
              excerpt: 'A useful excerpt',
              filters: {
                locale: ['en-US'],
              },
              meta: {
                title: 'Guide Title',
              },
              raw_url: '/guide/index.html',
              sub_results: [
                {
                  anchor: 'intro',
                  excerpt: 'Intro excerpt',
                  title: 'Intro',
                  url: '/guide#intro',
                },
              ],
              url: '/guide',
            }),
            id: 'guide-1',
          },
        ],
      }
    })
    const destroy = vi.fn(async () => {
      events.push('destroy')
    })
    const loadPagefindBrowser = vi.fn(async (_modulePath: string) => {
      events.push('load')

      return {
        destroy,
        init,
        options,
        preload,
        search,
      }
    })

    return {
      destroy,
      init,
      loadPagefindBrowser,
      options,
      preload,
      search,
    }
  })

vi.mock('../src/pagefind-browser-loader', () => ({
  loadPagefindBrowser,
}))

import { createSearchClient } from '../src/index'

describe('createSearchClient', () => {
  beforeEach(() => {
    destroy.mockClear()
    init.mockClear()
    loadPagefindBrowser.mockClear()
    options.mockClear()
    preload.mockClear()
    search.mockClear()
    events.length = 0
  })

  test('configures bundle path before init for nested deployments', async () => {
    const client = createSearchClient({
      basePath: '/docs/reference/',
    })

    await client.preload('guide')

    expect(loadPagefindBrowser).toHaveBeenCalledWith(
      '/docs/reference/pagefind/pagefind.js',
    )
    expect(options).toHaveBeenCalledWith({
      bundlePath: '/docs/reference/pagefind',
    })
    expect(events.slice(0, 3)).toEqual(['load', 'options', 'init'])
  })

  test('normalizes loaded search results by calling data()', async () => {
    const client = createSearchClient({
      basePath: '/docs/reference',
    })

    const result = await client.search('guide', {
      filters: {
        locale: ['en-US'],
      },
    })

    expect(search).toHaveBeenCalledWith('guide', {
      filters: {
        locale: ['en-US'],
      },
    })
    expect(result).toEqual({
      items: [
        {
          excerpt: 'A useful excerpt',
          filters: {
            locale: ['en-US'],
          },
          id: 'guide-1',
          meta: {
            title: 'Guide Title',
          },
          rawUrl: '/docs/reference/guide/index.html',
          subResults: [
            {
              anchor: 'intro',
              excerpt: 'Intro excerpt',
              title: 'Intro',
              url: '/docs/reference/guide#intro',
            },
          ],
          title: 'Guide Title',
          url: '/docs/reference/guide',
        },
      ],
      total: 1,
    })
  })

  test('does not prefix basePath when returned URLs already include it', async () => {
    search.mockResolvedValueOnce({
      results: [
        {
          data: async () => ({
            excerpt: 'Already rooted',
            filters: {
              locale: ['en-US'],
            },
            meta: {
              title: 'Rooted Guide',
            },
            raw_url: '/docs/reference/guide/index.html',
            sub_results: [
              {
                anchor: 'intro',
                excerpt: 'Intro excerpt',
                title: 'Intro',
                url: '/docs/reference/guide#intro',
              },
            ],
            url: '/docs/reference/guide',
          }),
          id: 'guide-rooted',
        },
      ],
    })

    const client = createSearchClient({
      basePath: '/docs/reference',
    })

    const result = await client.search('guide')

    expect(result).toEqual({
      items: [
        {
          excerpt: 'Already rooted',
          filters: {
            locale: ['en-US'],
          },
          id: 'guide-rooted',
          meta: {
            title: 'Rooted Guide',
          },
          rawUrl: '/docs/reference/guide/index.html',
          subResults: [
            {
              anchor: 'intro',
              excerpt: 'Intro excerpt',
              title: 'Intro',
              url: '/docs/reference/guide#intro',
            },
          ],
          title: 'Rooted Guide',
          url: '/docs/reference/guide',
        },
      ],
      total: 1,
    })
  })

  test('uses an explicit bundlePath for loader and forwarded options', async () => {
    const client = createSearchClient({
      bundlePath: '/custom/pagefind',
    })

    await client.preload('guide')

    expect(loadPagefindBrowser).toHaveBeenCalledWith(
      '/custom/pagefind/pagefind.js',
    )
    expect(options).toHaveBeenCalledWith({
      bundlePath: '/custom/pagefind',
    })
  })

  test('preload delegates with the same argument shape', async () => {
    const client = createSearchClient()
    const options = {
      filters: {
        section: 'guides',
      },
    }

    await client.preload('guide', options)

    expect(preload).toHaveBeenCalledWith('guide', options)
  })

  test('destroy resets client state so it re-initializes cleanly', async () => {
    const client = createSearchClient()

    await client.preload('guide')
    await client.destroy()
    await client.preload('guide')

    expect(destroy).toHaveBeenCalledTimes(1)
    expect(loadPagefindBrowser).toHaveBeenCalledTimes(2)
    expect(init).toHaveBeenCalledTimes(2)
    expect(options).toHaveBeenCalledTimes(2)
  })

  test('retries initialization cleanly after an init failure', async () => {
    init.mockRejectedValueOnce(new Error('init failed'))

    const client = createSearchClient()

    await expect(client.preload('guide')).rejects.toThrow('init failed')
    await client.preload('guide')

    expect(loadPagefindBrowser).toHaveBeenCalledTimes(2)
    expect(init).toHaveBeenCalledTimes(2)
    expect(preload).toHaveBeenCalledTimes(1)
  })

  test('destroy waits for in-flight initialization and re-initializes cleanly', async () => {
    let resolveInit: (() => void) | undefined
    init.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveInit = resolve
        }),
    )

    const client = createSearchClient()
    const pendingPreload = client.preload('guide')

    await vi.waitFor(() => {
      expect(init).toHaveBeenCalledTimes(1)
    })

    const pendingDestroy = client.destroy()

    resolveInit?.()

    await expect(pendingPreload).rejects.toThrow(
      'destroyed before initialization completed',
    )
    await pendingDestroy
    await client.preload('guide')

    expect(destroy).toHaveBeenCalledTimes(1)
    expect(loadPagefindBrowser).toHaveBeenCalledTimes(2)
    expect(init).toHaveBeenCalledTimes(2)
    expect(preload).toHaveBeenCalledTimes(1)
  })
})
