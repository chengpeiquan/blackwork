import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, test } from 'vitest'
import { createDocsSource, defineConfig } from '../src/index'
import { createDocsSourceFromManifest } from '../src/source/create-docs-source-from-manifest'

const fixtures = new Set<string>()

const createFixture = () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'blackwork-docs-package-'))
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
---

# Overview
`,
  )

  write(
    'contents/en/guide/getting-started.md',
    `---
title: Getting Started Markdown
description: Markdown fallback.
---

# Markdown fallback
`,
  )

  write(
    'contents/en/guide/getting-started.mdx',
    `---
title: Getting Started
description: Primary getting started document.
---

# Getting Started
`,
  )

  write(
    'contents/zh/index.mdx',
    `---
title: 概览
description: 从这里开始。
---

# 概览
`,
  )

  write(
    'contents/en/reference/configuration.mdx',
    `---
desc: Tune your locales here.
tags:
  - locales
  - routing
meta:
  audience: maintainers
---

# Configuration
`,
  )

  return rootDir
}

afterEach(() => {
  for (const fixture of fixtures) {
    rmSync(fixture, { recursive: true, force: true })
  }

  fixtures.clear()
})

describe('createDocsSource', () => {
  test('reads localized docs from contents directories and prefers mdx entries over markdown', () => {
    const rootDir = createFixture()
    const source = createDocsSource({
      rootDir,
      config: defineConfig({
        content: {
          defaultLocale: 'en',
          locales: {
            en: { code: 'en', label: 'English' },
            zh: { code: 'zh', label: '简体中文' },
          },
        },
      }),
    })

    expect(source.getLocaleCodes()).toEqual(['en', 'zh'])
    expect(source.getEntries('zh')).toHaveLength(1)

    const entry = source.getEntry('en', ['guide', 'getting-started'])

    expect(entry?.format).toBe('mdx')
    expect(entry?.title).toBe('Getting Started')
    expect(entry?.href).toBe('/guide/getting-started')
  })

  test('reads locale directories under contents when locales are not explicitly configured', () => {
    const rootDir = createFixture()
    const source = createDocsSource({
      rootDir,
      config: defineConfig({
        content: {
          defaultLocale: 'en',
        },
      }),
    })

    expect(source.getLocaleCodes()).toEqual(['en', 'zh'])
    expect(source.getEntries('zh').map((entry) => entry.href)).toEqual(['/zh'])
  })

  test('infers titles and descriptions and generates canonical and alias hrefs', () => {
    const rootDir = createFixture()
    const source = createDocsSource({
      rootDir,
      config: defineConfig({
        content: {
          defaultLocale: 'en',
          locales: {
            en: { code: 'en', label: 'English' },
            zh: { code: 'zh', label: '简体中文' },
          },
        },
      }),
    })

    const inferredEntry = source.getEntry('en', ['reference', 'configuration'])

    expect(inferredEntry?.title).toBe('Configuration')
    expect(inferredEntry?.description).toBe('Tune your locales here.')
    expect(source.getCanonicalHref('en', [])).toBe('/')
    expect(source.getCanonicalHref('en', ['reference', 'configuration'])).toBe(
      '/reference/configuration',
    )
    expect(source.getCanonicalHref('zh', [])).toBe('/zh')
    expect(source.getCanonicalHref('zh', ['guide', 'getting-started'])).toBe(
      '/zh/guide/getting-started',
    )
    expect(source.getLegacyAliasHref('en', [])).toBe('/en')
    expect(
      source.getLegacyAliasHref('en', ['reference', 'configuration']),
    ).toBe('/en/reference/configuration')
    expect(
      source.getLegacyAliasHref('zh', ['guide', 'getting-started']),
    ).toBeNull()
    expect(
      source.getAliasEntries().map((entry) => ({
        href: entry.href,
        legacyHref: entry.legacyHref,
      })),
    ).toEqual([
      {
        href: '/',
        legacyHref: '/en',
      },
      {
        href: '/guide/getting-started',
        legacyHref: '/en/guide/getting-started',
      },
      {
        href: '/reference/configuration',
        legacyHref: '/en/reference/configuration',
      },
    ])
  })

  test('reuses the shared frontmatter parser for richer frontmatter values', () => {
    const rootDir = createFixture()
    const source = createDocsSource({
      rootDir,
      config: defineConfig({
        content: {
          defaultLocale: 'en',
          locales: {
            en: { code: 'en', label: 'English' },
            zh: { code: 'zh', label: '简体中文' },
          },
        },
      }),
    })

    const entry = source.getEntry('en', ['reference', 'configuration'])

    expect(entry?.frontmatter.tags).toEqual(['locales', 'routing'])
    expect(entry?.frontmatter.meta).toEqual({
      audience: 'maintainers',
    })
  })

  test('omits default-locale alias entries when redirect aliases are disabled', () => {
    const rootDir = createFixture()
    const source = createDocsSource({
      rootDir,
      config: defineConfig({
        content: {
          defaultLocale: 'en',
          locales: {
            en: { code: 'en', label: 'English' },
            zh: { code: 'zh', label: '简体中文' },
          },
          enableDefaultLocaleRedirect: false,
        },
      }),
    })

    expect(source.getLegacyAliasHref('en', [])).toBeNull()
    expect(
      source.getLegacyAliasHref('en', ['reference', 'configuration']),
    ).toBeNull()
    expect(source.getAliasEntries()).toEqual([])
  })

  test('creates an equivalent docs source from a generated manifest entry list', async () => {
    const source = createDocsSourceFromManifest({
      defaultLocale: 'en',
      enableDefaultLocaleRedirect: true,
      localeCodes: ['en', 'zh'],
      entries: [
        {
          locale: 'en',
          slugSegments: [],
          href: '/',
          legacyHref: '/en',
          sourcePath: 'contents/en/index.mdx',
          format: 'mdx',
          title: 'Overview',
          description: 'Start here.',
          order: 1,
          frontmatter: {
            title: 'Overview',
          },
          loadSource: async () => '# Overview\n',
        },
        {
          locale: 'en',
          slugSegments: ['guide', 'getting-started'],
          href: '/guide/getting-started',
          legacyHref: '/en/guide/getting-started',
          sourcePath: 'contents/en/guide/getting-started.mdx',
          format: 'mdx',
          title: 'Getting Started',
          description: 'Primary getting started document.',
          order: 2,
          frontmatter: {
            title: 'Getting Started',
          },
          loadSource: async () => '# Getting Started\n',
        },
        {
          locale: 'zh',
          slugSegments: [],
          href: '/zh',
          legacyHref: null,
          sourcePath: 'contents/zh/index.mdx',
          format: 'mdx',
          title: '概览',
          description: '从这里开始。',
          order: 1,
          frontmatter: {
            title: '概览',
          },
          loadSource: async () => '# 概览\n',
        },
      ],
    })

    const entry = source.getEntry('en', ['guide', 'getting-started'])

    expect(source.getLocaleCodes()).toEqual(['en', 'zh'])
    expect(source.getAliasEntries().map((item) => item.legacyHref)).toEqual([
      '/en',
      '/en/guide/getting-started',
    ])
    expect(entry?.href).toBe('/guide/getting-started')
    await expect(entry?.loadSource?.()).resolves.toBe('# Getting Started\n')
  })
})
