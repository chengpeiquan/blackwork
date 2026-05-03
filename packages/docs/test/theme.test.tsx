import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, expect, test } from 'vitest'
import { createDocsSource, defineConfig, type DocsConfig } from '../src/index'

const fixtures = new Set<string>()

const extractMarkup = (html: string, pattern: RegExp) => {
  const match = html.match(pattern)
  return match?.[0] ?? ''
}

const createFixture = ({ includeManualDocs = false } = {}) => {
  const rootDir = mkdtempSync(join(tmpdir(), 'blackwork-docs-theme-'))
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
`,
  )

  write(
    'contents/en/guide/getting-started.mdx',
    `---
title: Getting Started
description: Learn the basics.
order: 2
---

# Getting Started
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
`,
    )
  }

  write(
    'contents/en/reference/configuration.mdx',
    `---
title: Configuration
description: Tune the site.
order: 3
---

# Configuration
`,
  )

  write(
    'contents/en/article/first-post.mdx',
    `---
title: First Post
description: Notes from the content lane.
order: 4
---

# First Post
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
description: 学习基础内容。
order: 2
---

# 快速开始
`,
  )

  return rootDir
}

const createEmptyFixture = () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'blackwork-docs-theme-empty-'))
  fixtures.add(rootDir)
  mkdirSync(join(rootDir, 'contents'), { recursive: true })
  return rootDir
}

const createThemeContext = (
  overrides: DocsConfig = {},
  options: { includeManualDocs?: boolean } = {},
) => {
  const rootDir = createFixture(options)
  const baseConfig: DocsConfig = {
    site: {
      title: 'Project Docs',
      description: 'Reference docs for the project.',
    },
    content: {
      defaultLocale: 'en',
      locales: {
        en: { code: 'en', label: 'English', lang: 'en-US' },
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
    ...overrides,
    site: {
      ...baseConfig.site,
      ...overrides.site,
    },
    content: {
      ...baseConfig.content,
      ...overrides.content,
    },
    home: {
      ...baseConfig.home,
      ...overrides.home,
    },
    slots: {
      ...baseConfig.slots,
      ...overrides.slots,
    },
  })
  const source = createDocsSource({ rootDir, config })
  const entry = source.getEntry('en', ['guide', 'getting-started'])
  const articleEntry = source.getEntry('en', ['article', 'first-post'])

  if (!entry || !articleEntry) {
    throw new Error('Expected fixture entries to exist')
  }

  return {
    config,
    source,
    entry,
    articleEntry,
  }
}

afterEach(() => {
  for (const fixture of fixtures) {
    rmSync(fixture, { recursive: true, force: true })
  }

  fixtures.clear()
})

test('DefaultDocsShell renders the default header footer and docs scaffolding', async () => {
  const { DefaultDocsShell } = await import('@blackwork/docs/theme')
  const { config, source, entry } = createThemeContext()
  const html = renderToStaticMarkup(
    React.createElement(
      DefaultDocsShell,
      {
        config,
        source,
        entry,
      },
      React.createElement('p', null, 'Rendered body'),
    ),
  )
  const sidebarMarkup = extractMarkup(
    html,
    /<aside data-docs-region="sidebar"[\s\S]*?<\/aside>/,
  )

  expect(html).toContain('data-docs-region="header"')
  expect(html).toContain('data-docs-region="docs-shell"')
  expect(html).toContain('data-docs-region="sidebar"')
  expect(html).toContain('data-docs-region="article-body"')
  expect(html).toContain('data-docs-region="footer"')
  expect(html).toContain('data-pagefind-body=""')
  expect(html).toContain('data-pagefind-filter="kind:docs"')
  expect(html).toContain('data-pagefind-filter="locale:en"')
  expect(html).toContain('data-pagefind-filter="language:en"')
  expect(html).toContain('data-pagefind-filter="section:guide"')
  expect(html).toContain('data-pagefind-filter="layout:docs"')
  expect(html).toContain('max-w-screen-2xl')
  expect(html).toContain('aria-label="Scroll to top"')
  expect(html).toContain('aria-label="Open section navigation"')
  expect(html).toContain('>Sections<')
  expect(html).toContain('hidden w-full shrink-0 lg:block lg:w-72')
  expect(html).toContain('lg:w-72')
  expect(html).toContain('lg:gap-14')
  expect(html).toContain('xl:gap-20')
  expect(html).toContain('2xl:gap-24')
  expect(html).toContain('box-border px-6 sm:px-8 md:px-12 lg:px-16')
  expect(html).toContain('aria-label="Toggle theme"')
  expect(html).toContain('Project Docs')
  expect(html).toContain('Getting Started')
  expect(html).toContain('Rendered body')
  expect(sidebarMarkup).not.toContain('>Overview<')
  expect(html).toContain(
    'data-docs-region="article-body" class="prose prose-neutral max-w-none dark:prose-invert"',
  )
})

test('DefaultContentShell omits the docs sidebar rail while keeping shared chrome', async () => {
  const { DefaultContentShell } = await import('@blackwork/docs/theme')
  const { config, source, articleEntry } = createThemeContext({
    theme: {
      toc: {
        title: {
          en: 'Article outline',
        },
        collapseLabel: 'Collapse article outline',
        expandLabel: 'Expand article outline',
        openLabel: 'Open article outline',
      },
    },
  })
  const html = renderToStaticMarkup(
    React.createElement(
      DefaultContentShell,
      {
        config,
        source,
        entry: articleEntry,
        headings: [
          {
            depth: 2,
            id: 'content-overview',
            value: 'Content Overview',
          },
          {
            depth: 2,
            id: 'content-details',
            value: 'Content Details',
          },
        ],
      },
      React.createElement('p', null, 'Rendered content body'),
    ),
  )
  const contentShellMarkup = extractMarkup(
    html,
    /<main data-docs-region="content-shell"[\s\S]*?<\/main>/,
  )
  const tocMarkup = extractMarkup(
    html,
    /<aside data-docs-region="toc"[\s\S]*?<\/aside>/,
  )

  expect(html).toContain('data-docs-region="content-shell"')
  expect(html).toContain('data-docs-region="header"')
  expect(html).toContain('data-docs-region="article-body"')
  expect(html).toContain('data-docs-region="pager"')
  expect(html).toContain('data-docs-region="toc"')
  expect(html).toContain('data-pagefind-body=""')
  expect(html).toContain('data-pagefind-filter="kind:docs"')
  expect(html).toContain('data-pagefind-filter="locale:en"')
  expect(html).toContain('data-pagefind-filter="language:en"')
  expect(html).toContain('data-pagefind-filter="section:article"')
  expect(html).toContain('data-pagefind-filter="layout:content"')
  expect(html).toContain('href="#content-overview"')
  expect(html).toContain('href="#content-details"')
  expect(html).toContain('aria-label="Scroll to top"')
  expect(html).toContain('data-docs-toc-mobile-trigger="true"')
  expect(html).toContain('aria-label="Open article outline"')
  expect(html).toContain(
    'style="bottom:72px;height:40px;position:fixed;right:20px;width:40px;z-index:10"',
  )
  expect(html).toContain('data-docs-toc-toggle="true"')
  expect(html).toContain('Article outline')
  expect(html).toContain('aria-label="Collapse article outline"')
  expect(html).toContain('aria-expanded="true"')
  expect(html).not.toContain('data-docs-region="sidebar"')
  expect(html).toContain('Rendered content body')
  expect(tocMarkup).toContain('xl:fixed')
  expect(tocMarkup).toContain('xl:right-8')
  expect(tocMarkup).toContain('xl:top-24')
  expect(tocMarkup).toContain('M16 12H3m13 6H3M16 6H3')
  expect(contentShellMarkup).toContain('max-w-screen-2xl')
  expect(contentShellMarkup).not.toContain('data-docs-region="toc"')
  expect(contentShellMarkup).toContain('flex flex-col gap-5')
  expect(contentShellMarkup).not.toContain('pb-8')
  expect(contentShellMarkup).not.toContain('border-b border-border/60')
  expect(contentShellMarkup).not.toContain('Notes from the content lane.')
  expect(contentShellMarkup).not.toContain('max-w-3xl text-muted-foreground')
  expect(
    contentShellMarkup.match(
      /aria-hidden="true" class="hidden w-64 shrink-0 xl:block"/g,
    )?.length,
  ).toBe(2)
  expect(contentShellMarkup).toContain('flex min-w-0 flex-1 justify-center')
  expect(contentShellMarkup).toContain('flex w-full max-w-4xl flex-col gap-8')
  expect(contentShellMarkup).toContain(
    'data-pagefind-body="" class="flex flex-col gap-8"',
  )
})

test('DefaultContentShell renders the content header metadata slot', async () => {
  const { DefaultContentShell } = await import('@blackwork/docs/theme')
  const HeaderMeta: React.FC<{ entry: { title: string } }> = ({ entry }) =>
    React.createElement(
      'div',
      { 'data-testid': 'content-header-meta' },
      `Meta for ${entry.title}`,
    )
  const { config, source, articleEntry } = createThemeContext({
    slots: {
      contentHeaderMeta: HeaderMeta,
    },
  })
  const html = renderToStaticMarkup(
    React.createElement(
      DefaultContentShell,
      {
        config,
        source,
        entry: articleEntry,
      },
      React.createElement('p', null, 'Rendered content body'),
    ),
  )

  expect(html).toContain('data-docs-region="article-header-meta"')
  expect(html).toContain('data-testid="content-header-meta"')
  expect(html).toContain(`Meta for ${articleEntry.title}`)
})

test('DefaultContentShell hides the toc rail when headings are too sparse', async () => {
  const { DefaultContentShell } = await import('@blackwork/docs/theme')
  const { config, source, articleEntry } = createThemeContext()
  const html = renderToStaticMarkup(
    React.createElement(
      DefaultContentShell,
      {
        config,
        source,
        entry: articleEntry,
        headings: [
          {
            depth: 2,
            id: 'content-overview',
            value: 'Content Overview',
          },
        ],
      },
      React.createElement('p', null, 'Rendered content body'),
    ),
  )

  expect(html).not.toContain('data-docs-region="toc"')
  expect(html).not.toContain('data-docs-toc-toggle="true"')
  expect(html).not.toContain('data-docs-toc-mobile-trigger="true"')
  expect(html).not.toContain(
    'aria-hidden="true" class="hidden w-64 shrink-0 xl:block"',
  )
})

test('DefaultDocsToc keeps a single entry control when collapsed', async () => {
  const { DefaultDocsToc } = await import('../src/theme/components/docs-toc')
  const headings = [
    {
      depth: 2,
      id: 'content-overview',
      title: 'Content Overview',
    },
    {
      depth: 2,
      id: 'content-details',
      title: 'Content Details',
    },
  ]
  const leftHtml = renderToStaticMarkup(
    React.createElement(DefaultDocsToc, {
      collapseEnabled: true,
      defaultCollapsed: true,
      headings,
    }),
  )
  const rightHtml = renderToStaticMarkup(
    React.createElement(DefaultDocsToc, {
      collapseDirection: 'right',
      collapseEnabled: true,
      defaultCollapsed: true,
      headings,
    }),
  )
  const tocMarkup = extractMarkup(
    leftHtml,
    /<aside data-docs-region="toc"[\s\S]*?<\/aside>/,
  )
  const toggleMarkup = extractMarkup(
    tocMarkup,
    /<button[\s\S]*?data-docs-toc-toggle="true"[\s\S]*?<\/button>/,
  )

  expect(tocMarkup).toContain('data-docs-toc-collapsed="true"')
  expect(tocMarkup).toContain('data-docs-toc-toggle="true"')
  expect(tocMarkup).not.toContain('transition-[width]')
  expect(tocMarkup).toContain('aria-hidden="true"')
  expect(tocMarkup).toContain('transition-opacity')
  expect(tocMarkup).toContain('pointer-events-none opacity-0')
  expect(tocMarkup).not.toContain('transition-[opacity,transform]')
  expect(tocMarkup).not.toContain('translate-x-2')
  expect(toggleMarkup).toContain('aria-label="Expand outline"')
  expect(toggleMarkup).toContain('aria-expanded="false"')
  expect(toggleMarkup).toContain('type="button"')
  expect(toggleMarkup).toContain('left-0')
  expect(toggleMarkup).toContain('opacity-100')
  expect(toggleMarkup).not.toContain('h-auto w-auto')
  expect(toggleMarkup).not.toContain('border-border/60')
  expect(rightHtml).toContain('right-0')
})

test('DefaultDocsToc gives the scroll list a flex parent', async () => {
  const { DefaultDocsToc } = await import('../src/theme/components/docs-toc')
  const html = renderToStaticMarkup(
    React.createElement(DefaultDocsToc, {
      headings: [
        {
          depth: 2,
          id: 'content-overview',
          title: 'Content Overview',
        },
        {
          depth: 2,
          id: 'content-details',
          title: 'Content Details',
        },
      ],
    }),
  )

  expect(html).toContain('relative flex min-h-0 flex-col')
  expect(html).toContain(
    'flex flex-col overflow-auto py-1 [scrollbar-width:none] max-h-[calc(100dvh-8rem)]',
  )
})

test('DefaultDocsHeader keeps the top navigation compact', async () => {
  const { DefaultDocsHeader } = await import('@blackwork/docs/theme')
  const html = renderToStaticMarkup(
    React.createElement(DefaultDocsHeader, {
      homeHref: '/',
      localeLinks: [
        {
          locale: 'en',
          href: '/',
          label: 'English',
          lang: 'en-US',
          current: true,
        },
        {
          locale: 'zh',
          href: '/zh',
          label: '简体中文',
          lang: 'zh-CN',
          current: false,
        },
      ],
      navigation: [
        {
          href: '/guide/getting-started',
          label: 'Getting Started',
          current: false,
        },
      ],
      siteDescription: 'Reference docs for the project.',
      siteTitle: 'Project Docs',
    }),
  )

  expect(html).toContain('data-docs-region="header"')
  expect(html).toContain('data-docs-region="header-brand"')
  expect(html).toContain('Project Docs')
  expect(html).toContain('sticky top-0')
  expect(html).toContain('h-16')
  expect(html).toContain('aria-label="Change language"')
  expect(html).toContain('data-current-locale="true"')
  expect(html).not.toContain('Reference docs for the project.')
  expect(html).not.toContain('aria-label="Locales"')
  expect(html).not.toContain('aria-label="Primary navigation"')
})

test('DefaultDocsShell lets a footer slot replace the default footer', async () => {
  const { DefaultDocsShell } = await import('@blackwork/docs/theme')
  const FooterSlot: React.FC = () =>
    React.createElement(
      'div',
      {
        'data-slot': 'custom-footer',
      },
      'Custom footer slot',
    )
  const { config, source, entry } = createThemeContext({
    slots: {
      footer: FooterSlot,
    },
  })
  const html = renderToStaticMarkup(
    React.createElement(
      DefaultDocsShell,
      {
        config,
        source,
        entry,
      },
      React.createElement('p', null, 'Rendered body'),
    ),
  )

  expect(html).toContain('data-slot="custom-footer"')
  expect(html).toContain('Custom footer slot')
  expect(html).not.toContain('data-docs-region="footer"')
})

test('DefaultDocsShell renders configured header actions inside the default header', async () => {
  const { DefaultDocsShell } = await import('@blackwork/docs/theme')
  const HeaderActionsSlot: React.FC<{ siteTitle: string }> = ({ siteTitle }) =>
    React.createElement(
      'div',
      {
        'data-slot': 'custom-header-actions',
      },
      `Search ${siteTitle}`,
    )
  const { config, source, entry } = createThemeContext({
    slots: {
      headerActions: HeaderActionsSlot,
    },
  })
  const html = renderToStaticMarkup(
    React.createElement(
      DefaultDocsShell,
      {
        config,
        source,
        entry,
      },
      React.createElement('p', null, 'Rendered body'),
    ),
  )

  expect(html).toContain('data-slot="custom-header-actions"')
  expect(html).toContain('Search Project Docs')
})

test('DefaultDocsShell uses the configured link slot across theme links', async () => {
  const { DefaultDocsShell } = await import('@blackwork/docs/theme')
  const LinkSlot: React.FC<
    React.PropsWithChildren<{ href: string; className?: string }>
  > = ({ children, href, ...props }) =>
    React.createElement(
      'a',
      {
        ...props,
        href,
        'data-link-slot': href,
      },
      children,
    )
  const { config, source, entry } = createThemeContext({
    slots: {
      link: LinkSlot,
    },
  })
  const html = renderToStaticMarkup(
    React.createElement(
      DefaultDocsShell,
      {
        config,
        source,
        entry,
      },
      React.createElement('p', null, 'Rendered body'),
    ),
  )

  expect(html).toContain('data-link-slot="/"')
  expect(html).toContain('data-link-slot="/guide/getting-started"')
  expect(html).not.toContain('data-link-slot="/reference/configuration"')
})

test('DefaultDocsShell renders manual groups and uses manual pager order', async () => {
  const { DefaultDocsShell } = await import('@blackwork/docs/theme')
  const { config, source, entry } = createThemeContext(
    {
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
    {
      includeManualDocs: true,
    },
  )
  const html = renderToStaticMarkup(
    React.createElement(
      DefaultDocsShell,
      {
        config,
        source,
        entry,
      },
      React.createElement('p', null, 'Rendered body'),
    ),
  )
  const sidebarMarkup = extractMarkup(
    html,
    /<aside data-docs-region="sidebar"[\s\S]*?<\/aside>/,
  )

  expect(sidebarMarkup).toContain('Foundations')
  expect(sidebarMarkup).toContain('Resources')
  expect(sidebarMarkup).toContain('>Guide<')
  expect(sidebarMarkup).toContain('>Quickstart<')
  expect(sidebarMarkup).toContain('>Changelog<')
  expect(sidebarMarkup).toContain('>Configuration Reference<')
  expect(sidebarMarkup.indexOf('Foundations')).toBeLessThan(
    sidebarMarkup.indexOf('Resources'),
  )
  expect(html).toContain('Previous: Guide')
  expect(html).toContain('Next: Configuration Reference')
  expect(html).not.toContain('Next: Changelog')
})

test('DefaultHomeShell builds an automatic landing page from the docs source', async () => {
  const { DefaultHomeShell } = await import('@blackwork/docs/theme')
  const { config, source } = createThemeContext()
  const html = renderToStaticMarkup(
    React.createElement(DefaultHomeShell, {
      config,
      locale: 'en',
      source,
    }),
  )

  expect(html).toContain('data-home-mode="auto"')
  expect(html).toContain('min-h-[calc(100dvh-4rem)]')
  expect(html).toContain('Project Docs')
  expect(html).toContain('Overview')
  expect(html).toContain('Getting Started')
  expect(html).toContain('data-docs-region="header"')
  expect(html).toContain('aria-label="Scroll to top"')
  expect(html).toContain('data-pagefind-body=""')
  expect(html).toContain('data-pagefind-filter="kind:docs"')
  expect(html).toContain('data-pagefind-filter="locale:en"')
  expect(html).toContain('data-pagefind-filter="language:en"')
  expect(html).not.toContain('data-docs-region="footer"')
  expect(html).not.toContain('data-docs-region="home-highlights"')
})

test('DefaultHomeShell renders configured landing content when home config is provided', async () => {
  const { DefaultHomeShell } = await import('@blackwork/docs/theme')
  const { config, source } = createThemeContext({
    home: {
      badge: 'Configured landing',
      eyebrow: 'Release docs with confidence',
      title: 'Ship a better docs experience',
      description: 'Bring guides, reference material, and releases together.',
      primaryAction: {
        href: '/guide/getting-started',
        label: 'Start reading',
      },
      secondaryAction: {
        href: '/reference/configuration',
        label: 'Open configuration',
      },
    },
  })
  const html = renderToStaticMarkup(
    React.createElement(DefaultHomeShell, {
      config,
      locale: 'en',
      source,
    }),
  )

  expect(html).toContain('data-home-mode="configured"')
  expect(html).toContain('Configured landing')
  expect(html).toContain('Ship a better docs experience')
  expect(html).toContain(
    'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium',
  )
  expect(html).toContain('h-11 rounded-full px-6 shadow-sm')
  expect(html).toContain('Start reading')
  expect(html).toContain('h-11 rounded-full px-6')
  expect(html).toContain('Open configuration')
  expect(html).not.toContain('data-docs-region="home-highlights"')
})

test('createHomeData localizes configured home actions for non-default locales', async () => {
  const { createHomeData } = await import('@blackwork/docs/theme')
  const { config, source } = createThemeContext({
    home: {
      primaryAction: {
        href: '/guide/getting-started',
        label: 'Start reading',
      },
      secondaryAction: {
        href: '/guide/getting-started',
        label: 'Read more',
      },
    },
  })

  const home = createHomeData({
    config,
    locale: 'zh',
    source,
  })

  expect(home.primaryAction).toEqual({
    href: '/zh/guide/getting-started',
    label: 'Start reading',
  })
  expect(home.secondaryAction).toEqual({
    href: '/zh/guide/getting-started',
    label: 'Read more',
  })
})

test('DefaultHomeShell renders configured highlights after the hero', async () => {
  const { DefaultHomeShell } = await import('@blackwork/docs/theme')
  const { config, source } = createThemeContext({
    home: {
      highlights: [
        {
          href: '/guide/getting-started',
          title: 'Guides',
          description: 'Learn the basics.',
        },
      ],
    },
  })
  const html = renderToStaticMarkup(
    React.createElement(DefaultHomeShell, {
      config,
      locale: 'en',
      source,
    }),
  )

  expect(html).toContain('data-docs-region="home-highlights"')
  expect(html).toMatch(
    /class="(?=[^"]*\brounded-lg\b)(?=[^"]*\bborder\b)(?=[^"]*\bbg-card\b)(?=[^"]*\btext-card-foreground\b)(?=[^"]*\bshadow-sm\b)[^"]*"/,
  )
  expect(html).toContain('Guides')
})

test('createHomeData keeps zero-doc auto home empty states accurate', async () => {
  const { createHomeData } = await import('@blackwork/docs/theme')
  const rootDir = createEmptyFixture()
  const config = defineConfig({
    site: {
      title: 'Empty Docs',
    },
    content: {
      defaultLocale: 'en',
      locales: {
        en: { code: 'en', label: 'English', lang: 'en-US' },
      },
    },
  })
  const source = createDocsSource({ rootDir, config })
  const home = createHomeData({
    config,
    locale: 'en',
    source,
  })

  expect(home.mode).toBe('auto')
  expect(home.badge).toBe('0 pages')
  expect(home.highlights).toEqual([])
  expect(home.primaryAction).toEqual({
    href: '/',
    label: 'Browse docs',
  })
})
