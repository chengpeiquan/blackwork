import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, test, vi } from 'vitest'

const getGuideSidebarHrefs = (sidebar: unknown): string[] => {
  if (!Array.isArray(sidebar)) {
    return []
  }

  return sidebar.flatMap((group) => {
    if (group?.type === 'group' && Array.isArray(group.items)) {
      return group.items.map((item) => item.href)
    }

    return typeof group?.href === 'string' ? [group.href] : []
  })
}

const docsExports = vi.hoisted(() => {
  return {
    DocsPage:
      vi.fn<
        (options: {
          onRedirect?: (
            href: string,
          ) => React.ReactNode | Promise<React.ReactNode>
        }) => Promise<React.ReactNode | undefined>
      >(),
    DocsRootLayout:
      vi.fn<
        (props: {
          children?: React.ReactNode
          config: unknown
          params?: Promise<{ slug?: string[] }>
        }) => React.ReactNode
      >(),
    generateMetadata:
      vi.fn<
        (options: {
          config: unknown
          params?: Promise<{ slug?: string[] }>
          rootDir?: string
        }) => Promise<Record<string, unknown>>
      >(),
    generateStaticParams:
      vi.fn<
        (options: {
          config: unknown
          rootDir?: string
        }) => Promise<Array<{ slug: string[] }>>
      >(),
  }
})

vi.mock('@blackwork/docs', () => ({
  DocsPage: docsExports.DocsPage,
  DocsRootLayout: docsExports.DocsRootLayout,
  defineConfig: <T>(config: T) => config,
  defineDocsConfig: <T extends Record<string, unknown>>(config: T) => ({
    content: {
      root: 'src/contents',
      defaultLocale: 'en',
      enableDefaultLocaleRedirect: true,
      locales: {
        en: {
          code: 'en',
          lang: 'en-US',
          label: 'English',
        },
        zh: {
          code: 'zh',
          lang: 'zh-CN',
          label: '简体中文',
        },
      },
    },
    ...config,
  }),
  dynamicParams: false,
  generateMetadata: docsExports.generateMetadata,
  generateStaticParams: docsExports.generateStaticParams,
}))

vi.mock('blackwork/ui-globals.css', () => ({}))
vi.mock('../globals.css', () => ({}))

afterEach(() => {
  docsExports.DocsPage.mockReset()
  docsExports.DocsRootLayout.mockReset()
  docsExports.generateMetadata.mockReset()
  docsExports.generateStaticParams.mockReset()
  vi.resetModules()
  vi.restoreAllMocks()
  delete process.env.NEXT_OUTPUT
})

describe('docs starter integration', () => {
  test('keeps the app layout free of starter-specific live reload helpers', () => {
    const layoutSource = readFileSync(
      join(process.cwd(), 'src/app/layout.tsx'),
      'utf8',
    )

    expect(layoutSource).toContain('DocsRootLayout')
    expect(layoutSource).not.toContain('ContentLiveReload')
    expect(layoutSource).not.toContain('docs-content-version')
  })

  test('keeps the docs config free of manual content wiring', () => {
    const docsConfigSource = readFileSync(
      join(process.cwd(), 'docs.config.ts'),
      'utf8',
    )

    expect(docsConfigSource).toContain('defineDocsConfig')
    expect(docsConfigSource).not.toContain("from './content.config'")
  })

  test('wraps the app root with the package root layout', async () => {
    docsExports.DocsRootLayout.mockImplementation(({ children }) => {
      return React.createElement(
        'html',
        { 'data-docs-root': 'mock' },
        React.createElement('body', null, children),
      )
    })

    const { default: RootLayout } = await import('../layout')
    const { docsConfig } = await import('../../../docs.config')
    const params = Promise.resolve({
      slug: ['zh', 'guide', 'getting-started'],
    })
    const element = await RootLayout({
      children: React.createElement('div', null, 'Docs content'),
      params,
    })
    const html = renderToStaticMarkup(element)

    expect(docsExports.DocsRootLayout).toHaveBeenCalledWith(
      {
        config: docsConfig,
        children: expect.anything(),
        params,
      },
      undefined,
    )
    expect(html).toContain('data-docs-root="mock"')
    expect(html).toContain('Docs content')
  })

  test('defines the starter docs config through the package config helper', async () => {
    const { docsConfig } = await import('../../../docs.config')
    const { Callout } = await import('@/mdx/components/callout')
    const { DocsFadePreview } = await import('@/mdx/components/fade-preview')
    const { DocsHeaderSearchAction } = await import('@/search/docs-search')

    expect(docsConfig).toMatchObject({
      site: {
        title: 'Blackwork Docs Starter',
        description:
          'A static-first docs starter built on blackwork and @blackwork/docs.',
      },
      content: {
        root: 'src/contents',
        defaultLocale: 'en',
        enableDefaultLocaleRedirect: true,
        locales: {
          en: {
            code: 'en',
            lang: 'en-US',
            label: 'English',
          },
          zh: {
            code: 'zh',
            lang: 'zh-CN',
            label: '简体中文',
          },
        },
      },
      home: {
        badge: false,
        eyebrow: false,
        title: 'Blackwork Docs Starter',
        description:
          'A static-first docs starter built on blackwork and @blackwork/docs.',
        primaryAction: {
          href: '/guide/getting-started',
          label: 'Getting Started',
        },
        secondaryAction: {
          href: '/guide/mdx-playground',
          label: 'MDX Playground',
        },
        highlights: false,
      },
    })
    expect(docsConfig.mdx.components).toMatchObject({
      Callout,
      FadePreview: DocsFadePreview,
    })
    expect(docsConfig.slots?.headerActions).toBe(DocsHeaderSearchAction)
  })

  test('ships starter content config that teaches section layouts and manual sidebars', async () => {
    const { docsContentConfig } = await import('../../../content.config')
    const guideSidebarHrefs = getGuideSidebarHrefs(
      docsContentConfig.sections.guide.sidebar,
    )

    expect(docsContentConfig.locales).toMatchObject({
      en: {
        code: 'en',
        lang: 'en-US',
      },
      zh: {
        code: 'zh',
        lang: 'zh-CN',
      },
    })

    expect(docsContentConfig.sections).toMatchObject({
      guide: {
        layout: 'docs',
      },
      reference: {
        layout: 'content',
      },
    })

    expect(guideSidebarHrefs).toEqual(
      expect.arrayContaining([
        '/guide',
        '/guide/getting-started',
        '/guide/configuring-sections',
        '/reference/configuration',
      ]),
    )
  })

  test('delegates route generation and metadata to the package surface', async () => {
    docsExports.generateStaticParams.mockResolvedValue([{ slug: ['guide'] }])
    docsExports.generateMetadata.mockResolvedValue({
      title: 'Delegated metadata',
    })

    const route = await import('../[[...slug]]/page')
    const { docsConfig } = await import('../../../docs.config')
    const params = Promise.resolve({
      slug: ['guide', 'getting-started'],
    })

    expect(route.dynamicParams).toBe(false)
    await expect(route.generateStaticParams()).resolves.toEqual([
      { slug: ['guide'] },
    ])
    expect(docsExports.generateStaticParams).toHaveBeenCalledWith({
      config: docsConfig,
      rootDir: '.',
    })

    await expect(route.generateMetadata({ params })).resolves.toEqual({
      title: 'Delegated metadata',
    })
    expect(docsExports.generateMetadata).toHaveBeenCalledWith({
      config: docsConfig,
      params,
      rootDir: '.',
    })
  })

  test('renders package docs pages and preserves the legacy redirect screen for static export aliases', async () => {
    process.env.NEXT_OUTPUT = 'export'
    docsExports.DocsPage.mockImplementation(async ({ onRedirect }) => {
      return onRedirect?.('/guide/getting-started')
    })

    const route = await import('../[[...slug]]/page')
    const { docsConfig } = await import('../../../docs.config')
    const params = Promise.resolve({
      slug: ['en', 'guide', 'getting-started'],
    })
    const element = await route.default({ params })
    const html = renderToStaticMarkup(element as React.ReactElement)

    expect(docsExports.DocsPage).toHaveBeenCalledWith({
      config: docsConfig,
      onNotFound: expect.any(Function),
      onRedirect: expect.any(Function),
      params,
      rootDir: '.',
    })
    expect(html).toContain('Redirecting to the canonical URL')
    expect(html).toContain('/guide/getting-started')
  })
})
