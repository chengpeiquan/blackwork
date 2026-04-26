import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, test } from 'vitest'
import { createDocsSource, defineConfig } from '../src/index'

const fixtures = new Set<string>()

type DocsMetadata = {
  title: string
  description: string
  alternates: {
    canonical?: string
    languages?: Record<string, string>
  }
  robots?: {
    index?: boolean
    follow?: boolean
  }
}

const createFixture = () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'blackwork-docs-metadata-'))
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
order: 1
---

# Overview
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
description: 快速开始指南。
order: 2
---

# 快速开始
`,
  )

  write(
    'contents/ja/guide/getting-started.mdx',
    `---
title: はじめに
description: 日本語の開始ガイド。
order: 2
---

# はじめに
`,
  )

  return rootDir
}

const createSource = () => {
  const rootDir = createFixture()
  const config = defineConfig({
    site: {
      title: 'Blackwork Docs',
      description: 'Documentation for Blackwork projects.',
      url: 'https://docs.example.com',
    },
    content: {
      defaultLocale: 'en',
      locales: {
        en: { code: 'en', label: 'English', lang: 'en' },
        zh: { code: 'zh', label: '简体中文', lang: 'zh-CN' },
        ja: { code: 'ja', label: '日本語' },
      },
    },
  })

  return {
    config,
    source: createDocsSource({ rootDir, config }),
  }
}

const loadCreateDocMetadata = async () => {
  const module = (await import('../src/index')) as Record<string, unknown>
  expect(module).toHaveProperty('createDocMetadata')
  expect(typeof module.createDocMetadata).toBe('function')
  return module.createDocMetadata as (options: {
    config: ReturnType<typeof defineConfig>
    entry: NonNullable<
      ReturnType<ReturnType<typeof createSource>['source']['getEntry']>
    >
    pathname?: string
    source: ReturnType<typeof createDocsSource>
  }) => DocsMetadata
}

afterEach(() => {
  for (const fixture of fixtures) {
    rmSync(fixture, { recursive: true, force: true })
  }

  fixtures.clear()
})

describe('createDocMetadata', () => {
  test('generates title, description, and locale alternates keyed by lang when present', async () => {
    const createDocMetadata = await loadCreateDocMetadata()
    const { config, source } = createSource()
    const entry = source.getEntry('en', ['guide', 'getting-started'])

    expect(entry).not.toBeNull()

    const metadata = createDocMetadata({
      config,
      entry: entry!,
      source,
    })

    expect(metadata).toMatchObject({
      title: 'Getting Started | Blackwork Docs',
      description: 'Primary getting started guide.',
      alternates: {
        canonical: 'https://docs.example.com/guide/getting-started',
        languages: {
          en: 'https://docs.example.com/guide/getting-started',
          'zh-CN': 'https://docs.example.com/zh/guide/getting-started',
          ja: 'https://docs.example.com/ja/guide/getting-started',
        },
      },
    })
    expect(metadata.robots).toBeUndefined()
  })

  test('falls back to the site description when the entry description is empty', async () => {
    const createDocMetadata = await loadCreateDocMetadata()
    const { config, source } = createSource()
    const entry = source.getEntry('en', [])

    expect(entry).not.toBeNull()

    expect(
      createDocMetadata({
        config,
        entry: entry!,
        source,
      }),
    ).toMatchObject({
      title: 'Overview | Blackwork Docs',
      description: 'Documentation for Blackwork projects.',
      alternates: {
        canonical: 'https://docs.example.com/',
      },
    })
  })

  test('canonicalizes alias routes and marks them noindex', async () => {
    const createDocMetadata = await loadCreateDocMetadata()
    const { config, source } = createSource()
    const entry = source.getEntry('en', ['guide', 'getting-started'])

    expect(entry).not.toBeNull()

    expect(
      createDocMetadata({
        config,
        entry: entry!,
        pathname: '/en/guide/getting-started',
        source,
      }),
    ).toMatchObject({
      title: 'Getting Started | Blackwork Docs',
      description: 'Primary getting started guide.',
      alternates: {
        canonical: 'https://docs.example.com/guide/getting-started',
      },
      robots: {
        index: false,
        follow: true,
      },
    })
  })
})
