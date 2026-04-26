import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineConfig } from '../src/config/define-config'

const fixtures = new Set<string>()

type DocsRouteParams = {
  slug?: string[]
}

type DocsModule = {
  DocsPage: (options: {
    config: ReturnType<typeof defineConfig>
    params?: DocsRouteParams | Promise<DocsRouteParams>
    rootDir: string
  }) => Promise<React.ReactNode>
  DocsRootLayout: (
    props: React.PropsWithChildren<{
      config: ReturnType<typeof defineConfig>
      params?: DocsRouteParams | Promise<DocsRouteParams>
    }>,
  ) => React.ReactNode | Promise<React.ReactNode>
  dynamicParams: boolean
  generateMetadata: (options: {
    config: ReturnType<typeof defineConfig>
    params?: DocsRouteParams | Promise<DocsRouteParams>
    rootDir: string
  }) => Promise<Record<string, unknown>>
  generateStaticParams: (options: {
    config: ReturnType<typeof defineConfig>
    rootDir: string
  }) => Promise<DocsRouteParams[]>
}

const createFixture = ({ includeManualDocs = false } = {}) => {
  const rootDir = mkdtempSync(join(tmpdir(), 'blackwork-docs-next-entry-'))
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
description: Start here.
order: 1
---

# Overview

Welcome home.
`,
  )

  write(
    'contents/en/guide/getting-started.mdx',
    `---
title: Getting Started
description: Primary getting started guide.
order: 2
---

# Getting Started

This guide gets you shipping quickly.
`,
  )

  if (includeManualDocs) {
    write(
      'contents/en/guide/index.mdx',
      `---
title: Guide
description: Browse the guide.
order: 2
---

# Guide

Start here.
`,
    )

    write(
      'contents/en/reference/configuration.mdx',
      `---
title: Configuration
description: Tune the docs site.
order: 4
---

# Configuration

Adjust the docs experience.
`,
    )
  }

  write(
    'contents/en/article/first-post.mdx',
    `---
title: First Post
description: Notes from the content lane.
order: 3
---

# First Post

This page should not render a docs sidebar.
`,
  )

  write(
    'contents/zh/index.mdx',
    `---
title: 概览
description: 从这里开始。
order: 1
---

# 概览
`,
  )

  write(
    'contents/zh/guide/getting-started.mdx',
    `---
title: 快速开始
description: 中文快速开始指南。
order: 2
---

# 快速开始
`,
  )

  write(
    'contents/zh/article/first-post.mdx',
    `---
title: 第一篇文章
description: 内容布局测试页。
order: 3
---

# 第一篇文章
`,
  )

  return rootDir
}

const createContext = ({
  includeManualDocs = false,
  config: configOverrides = {},
}: {
  includeManualDocs?: boolean
  config?: Parameters<typeof defineConfig>[0]
} = {}) => {
  const rootDir = createFixture({ includeManualDocs })
  const baseConfig: Parameters<typeof defineConfig>[0] = {
    site: {
      title: 'Blackwork Docs',
      description: 'Reference docs for Blackwork.',
      url: 'https://docs.example.com',
    },
    content: {
      defaultLocale: 'en',
      locales: {
        en: { code: 'en', label: 'English', lang: 'en' },
        zh: { code: 'zh', label: '简体中文', lang: 'zh-CN' },
      },
      sections: {
        article: {
          layout: 'content',
        },
      },
    },
  }
  const config = defineConfig({
    ...baseConfig,
    ...configOverrides,
    site: {
      ...baseConfig.site,
      ...configOverrides.site,
    },
    content: {
      ...baseConfig.content,
      ...configOverrides.content,
      locales: {
        ...baseConfig.content?.locales,
        ...configOverrides.content?.locales,
      },
      sections: {
        ...baseConfig.content?.sections,
        ...configOverrides.content?.sections,
      },
    },
  })

  return {
    config,
    rootDir,
  }
}

const loadDocsModule = async () => {
  const docs = (await import('@blackwork/docs')) as Partial<DocsModule>

  expect(docs.dynamicParams).toBe(false)
  expect(typeof docs.DocsRootLayout).toBe('function')
  expect(typeof docs.DocsPage).toBe('function')
  expect(typeof docs.generateStaticParams).toBe('function')
  expect(typeof docs.generateMetadata).toBe('function')

  return docs as DocsModule
}

afterEach(() => {
  for (const fixture of fixtures) {
    rmSync(fixture, { recursive: true, force: true })
  }

  fixtures.clear()
  vi.resetModules()
})

describe('next root entry', () => {
  test('exports the Next integration surface from the root barrel', async () => {
    await expect(loadDocsModule()).resolves.toMatchObject({
      dynamicParams: false,
    })
  })

  test('derives static params and metadata from the shared routing and metadata helpers', async () => {
    const docs = await loadDocsModule()
    const { config, rootDir } = createContext()

    await expect(
      docs.generateStaticParams({
        config,
        rootDir,
      }),
    ).resolves.toEqual([
      {},
      { slug: ['article', 'first-post'] },
      { slug: ['en'] },
      { slug: ['en', 'article', 'first-post'] },
      { slug: ['en', 'guide', 'getting-started'] },
      { slug: ['guide', 'getting-started'] },
      { slug: ['zh'] },
      { slug: ['zh', 'article', 'first-post'] },
      { slug: ['zh', 'guide', 'getting-started'] },
    ])

    await expect(
      docs.generateMetadata({
        config,
        rootDir,
        params: Promise.resolve({
          slug: ['en', 'guide', 'getting-started'],
        }),
      }),
    ).resolves.toMatchObject({
      title: 'Getting Started | Blackwork Docs',
      description: 'Primary getting started guide.',
      alternates: {
        canonical: 'https://docs.example.com/guide/getting-started',
        languages: {
          en: 'https://docs.example.com/guide/getting-started',
          'zh-CN': 'https://docs.example.com/zh/guide/getting-started',
        },
      },
      robots: {
        index: false,
        follow: true,
      },
    })
  })

  test('renders the root layout and both canonical and alias page states', async () => {
    const docs = await loadDocsModule()
    const { config, rootDir } = createContext()
    const layoutHtml = renderToStaticMarkup(
      (await docs.DocsRootLayout({
        config,
        children: React.createElement('div', null, 'Docs content'),
      })) as React.ReactElement,
    )

    expect(layoutHtml).toContain('<html lang="en"')
    expect(layoutHtml).toContain('blackwork-theme')
    expect(layoutHtml).toContain('dark')
    expect(layoutHtml).toContain('Docs content')

    const homePage = await docs.DocsPage({
      config,
      rootDir,
      params: Promise.resolve({}),
    })
    const homeHtml = renderToStaticMarkup(homePage as React.ReactElement)

    expect(homeHtml).toContain('data-docs-region="home-shell"')
    expect(homeHtml).toContain('Blackwork Docs')
    expect(homeHtml).toContain('Reference docs for Blackwork.')

    const docsPage = await docs.DocsPage({
      config,
      rootDir,
      params: Promise.resolve({
        slug: ['guide', 'getting-started'],
      }),
    })
    const docsHtml = renderToStaticMarkup(docsPage as React.ReactElement)

    expect(docsHtml).toContain('data-docs-region="docs-shell"')
    expect(docsHtml).toContain('This guide gets you shipping quickly.')

    const contentPage = await docs.DocsPage({
      config,
      rootDir,
      params: Promise.resolve({
        slug: ['article', 'first-post'],
      }),
    })
    const contentHtml = renderToStaticMarkup(contentPage as React.ReactElement)

    expect(contentHtml).toContain('data-docs-region="content-shell"')
    expect(contentHtml).toContain('This page should not render a docs sidebar.')
    expect(contentHtml).not.toContain('data-docs-region="sidebar"')

    const aliasPage = await docs.DocsPage({
      config,
      rootDir,
      params: Promise.resolve({
        slug: ['en', 'guide', 'getting-started'],
      }),
    })
    const aliasHtml = renderToStaticMarkup(aliasPage as React.ReactElement)

    expect(aliasHtml).toContain('http-equiv="refresh"')
    expect(aliasHtml).toContain('/guide/getting-started')
    expect(aliasHtml).toContain('data-slot="empty"')
    expect(aliasHtml).toContain('Continue now')
  })

  test('DocsRootLayout prefers the configured locale lang metadata for the document lang', async () => {
    const docs = await loadDocsModule()
    const config = defineConfig({
      content: {
        defaultLocale: 'zh',
        locales: {
          en: { code: 'en', label: 'English', lang: 'en' },
          zh: { code: 'zh', label: '简体中文', lang: 'zh-CN' },
        },
      },
    })
    const layoutHtml = renderToStaticMarkup(
      (await docs.DocsRootLayout({
        config,
        children: React.createElement('div', null, 'Localized docs content'),
      })) as React.ReactElement,
    )

    expect(layoutHtml).toContain('<html lang="zh-CN"')
  })

  test('DocsRootLayout derives the document lang from the current route params', async () => {
    const docs = await loadDocsModule()
    const { config } = createContext()
    const layoutHtml = renderToStaticMarkup(
      (await docs.DocsRootLayout({
        config,
        params: Promise.resolve({
          slug: ['zh', 'guide', 'getting-started'],
        }),
        children: React.createElement('div', null, 'Localized docs content'),
      })) as React.ReactElement,
    )

    expect(layoutHtml).toContain('<html lang="zh-CN"')
  })

  test('DocsPage lets onNotFound handle missing routes', async () => {
    const docs = await loadDocsModule()
    const { config, rootDir } = createContext()
    const notFoundPage = await docs.DocsPage({
      config,
      rootDir,
      params: Promise.resolve({
        slug: ['missing'],
      }),
      onNotFound: () =>
        React.createElement(
          'section',
          {
            'data-docs-region': 'custom-not-found',
          },
          'Nothing matched this docs route.',
        ),
    })
    const html = renderToStaticMarkup(notFoundPage as React.ReactElement)

    expect(html).toContain('data-docs-region="custom-not-found"')
    expect(html).toContain('Nothing matched this docs route.')
  })

  test('DocsPage lets onRedirect handle alias routes', async () => {
    const docs = await loadDocsModule()
    const { config, rootDir } = createContext()
    const redirectPage = await docs.DocsPage({
      config,
      rootDir,
      params: Promise.resolve({
        slug: ['en', 'guide', 'getting-started'],
      }),
      onRedirect: (href) =>
        React.createElement(
          'section',
          {
            'data-docs-region': 'custom-redirect',
            'data-href': href,
          },
          `Redirect docs users to ${href}.`,
        ),
    })
    const html = renderToStaticMarkup(redirectPage as React.ReactElement)

    expect(html).toContain('data-docs-region="custom-redirect"')
    expect(html).toContain('data-href="/guide/getting-started"')
    expect(html).toContain('Redirect docs users to /guide/getting-started.')
  })

  test('prefers generated manifest entries over filesystem scanning when manifest data is available', async () => {
    vi.doMock(
      'private-blackwork-docs-root/.blackwork/docs/manifest.mjs',
      () => ({
        docsManifest: {
          defaultLocale: 'en',
          enableDefaultLocaleRedirect: true,
          localeCodes: ['en'],
          entries: [
            {
              locale: 'en',
              slugSegments: ['guide', 'getting-started'],
              href: '/guide/getting-started',
              legacyHref: '/en/guide/getting-started',
              sourcePath: '/virtual/docs/en/guide/getting-started.mdx',
              format: 'mdx',
              title: 'Generated Guide',
              description: 'Generated from manifest.',
              frontmatter: {
                title: 'Generated Guide',
                description: 'Generated from manifest.',
              },
              loadSource: async () => `---
title: Generated Guide
description: Generated from manifest.
---

# Generated Guide

Loaded from generated manifest.
`,
            },
          ],
        },
      }),
      {
        virtual: true,
      },
    )

    const docs = await loadDocsModule()
    const config = defineConfig({
      site: {
        title: 'Manifest Docs',
        description: 'Manifest-backed docs.',
      },
      content: {
        defaultLocale: 'en',
        locales: {
          en: { code: 'en', label: 'English', lang: 'en' },
        },
      },
    })

    await expect(
      docs.generateStaticParams({
        config,
        rootDir: '/virtual/docs-root',
      }),
    ).resolves.toEqual([
      { slug: ['en', 'guide', 'getting-started'] },
      { slug: ['guide', 'getting-started'] },
    ])

    const page = await docs.DocsPage({
      config,
      rootDir: '/virtual/docs-root',
      params: Promise.resolve({
        slug: ['guide', 'getting-started'],
      }),
    })
    const html = renderToStaticMarkup(page as React.ReactElement)

    expect(html).toContain('Loaded from generated manifest.')
    expect(html).toContain('Generated Guide')
  })

  test('DocsPage renders manual sidebars and uses manual pager order across groups', async () => {
    vi.doUnmock('private-blackwork-docs-root/.blackwork/docs/manifest.mjs')
    const docs = await loadDocsModule()
    const { config, rootDir } = createContext({
      includeManualDocs: true,
      config: {
        content: {
          sections: {
            guide: {
              layout: 'docs',
              sidebar: [
                {
                  type: 'group',
                  label: 'Foundations',
                  items: [
                    {
                      type: 'item',
                      href: '/guide',
                    },
                    {
                      type: 'item',
                      href: '/guide/getting-started',
                      label: 'Quickstart',
                    },
                  ],
                },
                {
                  type: 'group',
                  label: 'Resources',
                  items: [
                    {
                      type: 'item',
                      href: 'https://example.com/changelog',
                      label: 'Changelog',
                    },
                    {
                      type: 'item',
                      href: '/reference/configuration',
                      label: 'Configuration Reference',
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    })
    const page = await docs.DocsPage({
      config,
      rootDir,
      params: Promise.resolve({
        slug: ['guide', 'getting-started'],
      }),
    })
    const html = renderToStaticMarkup(page as React.ReactElement)

    expect(html).toContain('Foundations')
    expect(html).toContain('Resources')
    expect(html).toContain('Quickstart')
    expect(html).toContain('Changelog')
    expect(html).toContain('Configuration Reference')
    expect(html).toContain('Previous: Guide')
    expect(html).toContain('Next: Configuration Reference')
    expect(html).not.toContain('Next: Changelog')
  })
})
