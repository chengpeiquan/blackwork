import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, test } from 'vitest'
import { createDocsSource, defineConfig, type DocsConfig } from '../src/index'

const fixtures = new Set<string>()

type SidebarItem = {
  depth: number
  href: string
  slugSegments: string[]
  title: string
  parentHref?: string
  isActive: boolean
  isExternal?: boolean
}

type ResolvedSidebarItem = {
  type: 'item'
  depth: number
  href: string
  slugSegments: string[]
  title: string
  parentHref?: string
  isActive: boolean
  isExternal: boolean
}

type ResolvedSidebarGroup = {
  type: 'group'
  title: string
  items: ResolvedSidebarItem[]
}

type PagerLink = {
  href: string
  title: string
}

type LocaleLink = {
  locale: string
  href: string
  label?: string
  lang?: string
  current: boolean
}

const createFixture = ({ includeNestedApiOverview = false } = {}) => {
  const rootDir = mkdtempSync(join(tmpdir(), 'blackwork-docs-navigation-'))
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
    'contents/en/guide/index.mdx',
    `---
title: Guide
description: Browse the guide.
order: 2
---

# Guide
`,
  )

  write(
    'contents/en/guide/getting-started.mdx',
    `---
title: Getting Started
description: Primary getting started guide.
order: 3
---

# Getting Started
`,
  )

  write(
    'contents/en/reference/configuration.mdx',
    `---
title: Configuration
description: Tune your setup.
order: 4
---

# Configuration
`,
  )

  if (includeNestedApiOverview) {
    write(
      'contents/en/reference/api/overview.mdx',
      `---
title: API Overview
description: Browse the API surface.
order: 5
---

# API Overview
`,
    )
  }

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
description: 快速开始指南。
order: 3
---

# 快速开始
`,
  )

  write(
    'contents/zh/guide/index.mdx',
    `---
title: 指南
description: 浏览中文指南。
order: 2
---

# 指南
`,
  )

  return rootDir
}

const createSource = ({
  includeNestedApiOverview = false,
  config: configOverrides = {},
}: {
  includeNestedApiOverview?: boolean
  config?: DocsConfig
} = {}) => {
  const rootDir = createFixture({ includeNestedApiOverview })
  const baseConfig: DocsConfig = {
    content: {
      defaultLocale: 'en',
      locales: {
        en: { code: 'en', label: 'English', lang: 'en' },
        zh: { code: 'zh', label: '简体中文', lang: 'zh-CN' },
      },
    },
  }
  const config = defineConfig({
    ...baseConfig,
    ...configOverrides,
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
    source: createDocsSource({ rootDir, config }),
  }
}

const loadBuildSidebar = async () => {
  const module = (await import('../src/index')) as Record<string, unknown>
  expect(module).toHaveProperty('buildSidebar')
  expect(typeof module.buildSidebar).toBe('function')
  return module.buildSidebar as (options: {
    entries: ReturnType<ReturnType<typeof createSource>['source']['getEntries']>
    currentHref?: string
  }) => SidebarItem[]
}

const loadBuildPager = async () => {
  const module = (await import('../src/index')) as Record<string, unknown>
  expect(module).toHaveProperty('buildPager')
  expect(typeof module.buildPager).toBe('function')
  return module.buildPager as (options: {
    entries: ReturnType<ReturnType<typeof createSource>['source']['getEntries']>
    currentHref: string
  }) => {
    previous: PagerLink | null
    next: PagerLink | null
  }
}

const loadBuildLocaleLinks = async () => {
  const module = (await import('../src/index')) as Record<string, unknown>
  expect(module).toHaveProperty('buildLocaleLinks')
  expect(typeof module.buildLocaleLinks).toBe('function')
  return module.buildLocaleLinks as (options: {
    config: ReturnType<typeof defineConfig>
    entry: NonNullable<
      ReturnType<ReturnType<typeof createSource>['source']['getEntry']>
    >
    source: ReturnType<typeof createDocsSource>
  }) => LocaleLink[]
}

const loadResolveSidebar = async () => {
  const module = await import('../src/navigation/resolve-sidebar')
  expect(module).toHaveProperty('resolveSidebar')
  expect(typeof module.resolveSidebar).toBe('function')
  return module.resolveSidebar as (options: {
    config: ReturnType<typeof defineConfig>
    currentHref?: string
    entries: ReturnType<ReturnType<typeof createSource>['source']['getEntries']>
    sectionKey?: string
  }) => Array<ResolvedSidebarGroup | ResolvedSidebarItem>
}

afterEach(() => {
  for (const fixture of fixtures) {
    rmSync(fixture, { recursive: true, force: true })
  }

  fixtures.clear()
})

describe('docs navigation helpers', () => {
  test('buildSidebar returns ordered sidebar items with parent structure from actual entries', async () => {
    const buildSidebar = await loadBuildSidebar()
    const { source } = createSource()

    expect(
      buildSidebar({
        entries: source.getEntries('en'),
        currentHref: '/guide/getting-started',
      }),
    ).toEqual([
      {
        depth: 0,
        href: '/',
        slugSegments: [],
        title: 'Overview',
        isActive: false,
      },
      {
        depth: 0,
        href: '/guide',
        slugSegments: ['guide'],
        title: 'Guide',
        isActive: false,
      },
      {
        depth: 1,
        href: '/guide/getting-started',
        slugSegments: ['guide', 'getting-started'],
        title: 'Getting Started',
        parentHref: '/guide',
        isActive: true,
      },
      {
        depth: 1,
        href: '/reference/configuration',
        slugSegments: ['reference', 'configuration'],
        title: 'Configuration',
        isActive: false,
      },
    ])
  })

  test('buildSidebar uses real localized parent entries instead of reconstructing hrefs', async () => {
    const buildSidebar = await loadBuildSidebar()
    const { source } = createSource()

    expect(
      buildSidebar({
        entries: source.getEntries('zh'),
        currentHref: '/zh/guide/getting-started',
      }),
    ).toEqual([
      {
        depth: 0,
        href: '/zh',
        slugSegments: [],
        title: '概览',
        isActive: false,
      },
      {
        depth: 0,
        href: '/zh/guide',
        slugSegments: ['guide'],
        title: '指南',
        isActive: false,
      },
      {
        depth: 1,
        href: '/zh/guide/getting-started',
        slugSegments: ['guide', 'getting-started'],
        title: '快速开始',
        parentHref: '/zh/guide',
        isActive: true,
      },
    ])
  })

  test('buildSidebar derives nested depth from slug hierarchy even without parent index pages', async () => {
    const buildSidebar = await loadBuildSidebar()
    const { source } = createSource({
      includeNestedApiOverview: true,
    })

    expect(
      buildSidebar({
        entries: source.getEntries('en'),
        currentHref: '/reference/api/overview',
      }),
    ).toEqual([
      {
        depth: 0,
        href: '/',
        slugSegments: [],
        title: 'Overview',
        isActive: false,
      },
      {
        depth: 0,
        href: '/guide',
        slugSegments: ['guide'],
        title: 'Guide',
        isActive: false,
      },
      {
        depth: 1,
        href: '/guide/getting-started',
        slugSegments: ['guide', 'getting-started'],
        parentHref: '/guide',
        title: 'Getting Started',
        isActive: false,
      },
      {
        depth: 1,
        href: '/reference/configuration',
        slugSegments: ['reference', 'configuration'],
        title: 'Configuration',
        isActive: false,
      },
      {
        depth: 2,
        href: '/reference/api/overview',
        slugSegments: ['reference', 'api', 'overview'],
        title: 'API Overview',
        isActive: true,
      },
    ])
  })

  test('buildPager returns previous and next entries from the ordered locale entries', async () => {
    const buildPager = await loadBuildPager()
    const { source } = createSource()

    expect(
      buildPager({
        entries: source.getEntries('en'),
        currentHref: '/guide/getting-started',
      }),
    ).toEqual({
      previous: {
        href: '/guide',
        title: 'Guide',
      },
      next: {
        href: '/reference/configuration',
        title: 'Configuration',
      },
    })

    expect(
      buildPager({
        entries: source.getEntries('en'),
        currentHref: '/',
      }),
    ).toEqual({
      previous: null,
      next: {
        href: '/guide',
        title: 'Guide',
      },
    })
  })

  test('buildLocaleLinks returns canonical localized hrefs and skips missing translations', async () => {
    const buildLocaleLinks = await loadBuildLocaleLinks()
    const { config, source } = createSource()
    const gettingStartedEntry = source.getEntry('en', [
      'guide',
      'getting-started',
    ])
    const guideEntry = source.getEntry('en', ['guide'])

    expect(gettingStartedEntry).not.toBeNull()
    expect(guideEntry).not.toBeNull()

    expect(
      buildLocaleLinks({
        config,
        entry: gettingStartedEntry!,
        source,
      }),
    ).toEqual([
      {
        locale: 'en',
        href: '/guide/getting-started',
        label: 'English',
        lang: 'en',
        current: true,
      },
      {
        locale: 'zh',
        href: '/zh/guide/getting-started',
        label: '简体中文',
        lang: 'zh-CN',
        current: false,
      },
    ])

    expect(
      buildLocaleLinks({
        config,
        entry: guideEntry!,
        source,
      }),
    ).toEqual([
      {
        locale: 'en',
        href: '/guide',
        label: 'English',
        lang: 'en',
        current: true,
      },
      {
        locale: 'zh',
        href: '/zh/guide',
        label: '简体中文',
        lang: 'zh-CN',
        current: false,
      },
    ])
  })

  test('resolveSidebar localizes manual grouped sidebars and preserves external items', async () => {
    const resolveSidebar = await loadResolveSidebar()
    const buildSidebar = await loadBuildSidebar()
    const { config, source } = createSource({
      config: {
        content: {
          sections: {
            guide: {
              layout: 'docs',
              sidebar: [
                {
                  type: 'group',
                  label: {
                    en: 'Start',
                  },
                  items: [
                    {
                      type: 'item',
                      href: '/guide',
                    },
                  ],
                },
                {
                  type: 'group',
                  label: {
                    en: 'Resources',
                    zh: '资源',
                  },
                  items: [
                    {
                      type: 'item',
                      href: '/guide/getting-started',
                      label: {
                        en: 'Quick Start',
                      },
                    },
                    {
                      type: 'item',
                      href: 'https://example.com/changelog',
                      label: {
                        en: 'Changelog',
                        zh: '更新日志',
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    })

    expect(
      resolveSidebar({
        config,
        entries: source.getEntries('zh'),
        currentHref: '/zh/guide/getting-started',
        sectionKey: 'guide',
      }),
    ).toEqual([
      {
        type: 'group',
        title: 'Start',
        items: [
          {
            type: 'item',
            depth: 0,
            href: '/zh/guide',
            slugSegments: ['guide'],
            title: '指南',
            isActive: false,
            isExternal: false,
          },
        ],
      },
      {
        type: 'group',
        title: '资源',
        items: [
          {
            type: 'item',
            depth: 0,
            href: '/zh/guide/getting-started',
            slugSegments: ['guide', 'getting-started'],
            title: 'Quick Start',
            isActive: true,
            isExternal: false,
          },
          {
            type: 'item',
            depth: 0,
            href: 'https://example.com/changelog',
            slugSegments: [],
            title: '更新日志',
            isActive: false,
            isExternal: true,
          },
        ],
      },
    ])

    expect(
      buildSidebar({
        config,
        entries: source.getEntries('zh'),
        currentHref: '/zh/guide/getting-started',
        sectionKey: 'guide',
      }),
    ).toEqual([
      {
        depth: 0,
        href: '/zh/guide',
        slugSegments: ['guide'],
        title: '指南',
        isActive: false,
      },
      {
        depth: 0,
        href: '/zh/guide/getting-started',
        slugSegments: ['guide', 'getting-started'],
        title: 'Quick Start',
        isActive: true,
      },
      {
        depth: 0,
        href: 'https://example.com/changelog',
        slugSegments: [],
        title: '更新日志',
        isActive: false,
        isExternal: true,
      },
    ])
  })

  test('resolveSidebar throws actionable errors for missing internal manual links', async () => {
    const resolveSidebar = await loadResolveSidebar()
    const { config, source } = createSource({
      config: {
        content: {
          sections: {
            guide: {
              layout: 'docs',
              sidebar: [
                {
                  type: 'group',
                  label: 'Guide',
                  items: [
                    {
                      type: 'item',
                      href: '/guide/design',
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    })

    expect(() =>
      resolveSidebar({
        config,
        entries: source.getEntries('en'),
        currentHref: '/guide',
        sectionKey: 'guide',
      }),
    ).toThrowError(
      '[blackwork-docs] Invalid sidebar item in section "guide": href "/guide/design" does not match any document entry in locale "en". Add the page or remove the sidebar item.',
    )
  })
})
