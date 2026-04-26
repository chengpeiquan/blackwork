import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, test } from 'vitest'
import { createDocsSource, defineConfig } from '../src/index'

const fixtures = new Set<string>()

type RouteResolution =
  | {
      kind: 'page'
      locale: string
      slugSegments: string[]
      href: string
      entry: {
        title: string
      }
    }
  | {
      kind: 'redirect'
      locale: string
      slugSegments: string[]
      href: string
      entry: {
        title: string
      }
    }
  | {
      kind: 'notFound'
    }

type DocsRouteParams = {
  slug?: string[]
}

const createFixture = () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'blackwork-docs-routing-'))
  fixtures.add(rootDir)

  const write = (relativePath: string, source: string) => {
    const filePath = join(rootDir, relativePath)
    mkdirSync(join(filePath, '..'), { recursive: true })
    writeFileSync(filePath, source)
  }

  write(
    'contents/en/index.mdx',
    `---
title: Overview
---

# Overview
`,
  )

  write(
    'contents/en/guide/getting-started.mdx',
    `---
title: Getting Started
---

# Getting Started
`,
  )

  write(
    'contents/zh/index.mdx',
    `---
title: 概览
---

# 概览
`,
  )

  return rootDir
}

const createSource = () => {
  const rootDir = createFixture()
  const config = defineConfig({
    content: {
      defaultLocale: 'en',
      locales: {
        en: { code: 'en', label: 'English' },
        zh: { code: 'zh', label: '简体中文' },
      },
      enableDefaultLocaleRedirect: true,
    },
  })

  return {
    config,
    source: createDocsSource({ rootDir, config }),
  }
}

const createSourceWithoutDefaultLocale = () => {
  const rootDir = createFixture()
  const config = defineConfig({
    content: {
      locales: {
        en: { code: 'en', label: 'English' },
        zh: { code: 'zh', label: '简体中文' },
      },
    },
  })

  return {
    config,
    source: createDocsSource({ rootDir, config }),
  }
}

const createSourceWithRedirectDisabled = () => {
  const rootDir = createFixture()
  const config = defineConfig({
    content: {
      defaultLocale: 'en',
      locales: {
        en: { code: 'en', label: 'English' },
        zh: { code: 'zh', label: '简体中文' },
      },
      enableDefaultLocaleRedirect: false,
    },
  })

  return {
    config,
    source: createDocsSource({ rootDir, config }),
  }
}

const loadResolveDocsRoute = async () => {
  const module = (await import('../src/index')) as Record<string, unknown>
  expect(module).toHaveProperty('resolveDocsRoute')
  expect(typeof module.resolveDocsRoute).toBe('function')
  return module.resolveDocsRoute as (options: {
    source: ReturnType<typeof createDocsSource>
    params?: DocsRouteParams
  }) => RouteResolution
}

const loadBuildDocsStaticParams = async () => {
  const module = (await import('../src/index')) as Record<string, unknown>
  expect(module).toHaveProperty('buildDocsStaticParams')
  expect(typeof module.buildDocsStaticParams).toBe('function')
  return module.buildDocsStaticParams as (options: {
    source: ReturnType<typeof createDocsSource>
  }) => DocsRouteParams[]
}

afterEach(() => {
  for (const fixture of fixtures) {
    rmSync(fixture, { recursive: true, force: true })
  }

  fixtures.clear()
})

describe('docs routing helpers', () => {
  test('resolves the default-locale canonical route', async () => {
    const resolveDocsRoute = await loadResolveDocsRoute()
    const { source } = createSource()

    const result = resolveDocsRoute({
      source,
      params: {},
    })

    expect(result).toMatchObject({
      kind: 'page',
      locale: 'en',
      slugSegments: [],
      href: '/',
      entry: {
        title: 'Overview',
      },
    })
  })

  test('resolves prefixed locale routes', async () => {
    const resolveDocsRoute = await loadResolveDocsRoute()
    const { source } = createSource()

    const result = resolveDocsRoute({
      source,
      params: {
        slug: ['zh'],
      },
    })

    expect(result).toMatchObject({
      kind: 'page',
      locale: 'zh',
      slugSegments: [],
      href: '/zh',
      entry: {
        title: '概览',
      },
    })
  })

  test('redirects default-locale alias routes to canonical paths', async () => {
    const resolveDocsRoute = await loadResolveDocsRoute()
    const { source } = createSource()

    const result = resolveDocsRoute({
      source,
      params: {
        slug: ['en', 'guide', 'getting-started'],
      },
    })

    expect(result).toMatchObject({
      kind: 'redirect',
      locale: 'en',
      slugSegments: ['guide', 'getting-started'],
      href: '/guide/getting-started',
      entry: {
        title: 'Getting Started',
      },
    })
  })

  test('uses source policy when default-locale redirects are disabled', async () => {
    const resolveDocsRoute = await loadResolveDocsRoute()
    const buildDocsStaticParams = await loadBuildDocsStaticParams()
    const { source } = createSourceWithRedirectDisabled()

    expect(source.isDefaultLocaleRedirectEnabled()).toBe(false)
    expect(
      resolveDocsRoute({
        source,
        params: {
          slug: ['en', 'guide', 'getting-started'],
        },
      }),
    ).toEqual({
      kind: 'notFound',
    })
    expect(
      buildDocsStaticParams({
        source,
      }),
    ).toEqual([{}, { slug: ['guide', 'getting-started'] }, { slug: ['zh'] }])
  })

  test('does not fabricate an unprefixed default locale when none is configured', async () => {
    const resolveDocsRoute = await loadResolveDocsRoute()
    const buildDocsStaticParams = await loadBuildDocsStaticParams()
    const { source } = createSourceWithoutDefaultLocale()

    expect(source.getDefaultLocale()).toBeUndefined()
    expect(
      resolveDocsRoute({
        source,
        params: {},
      }),
    ).toEqual({
      kind: 'notFound',
    })
    expect(
      resolveDocsRoute({
        source,
        params: {
          slug: ['en'],
        },
      }),
    ).toMatchObject({
      kind: 'page',
      locale: 'en',
      slugSegments: [],
      href: '/en',
      entry: {
        title: 'Overview',
      },
    })
    expect(
      buildDocsStaticParams({
        source,
      }),
    ).toEqual([
      { slug: ['en'] },
      { slug: ['en', 'guide', 'getting-started'] },
      { slug: ['zh'] },
    ])
  })

  test('returns notFound when the route does not map to a document', async () => {
    const resolveDocsRoute = await loadResolveDocsRoute()
    const { source } = createSource()

    expect(
      resolveDocsRoute({
        source,
        params: {
          slug: ['missing'],
        },
      }),
    ).toEqual({
      kind: 'notFound',
    })
  })

  test('builds static params for canonical and alias paths', async () => {
    const buildDocsStaticParams = await loadBuildDocsStaticParams()
    const { source } = createSource()

    expect(
      buildDocsStaticParams({
        source,
      }),
    ).toEqual([
      {},
      { slug: ['en'] },
      { slug: ['en', 'guide', 'getting-started'] },
      { slug: ['guide', 'getting-started'] },
      { slug: ['zh'] },
    ])
  })
})
