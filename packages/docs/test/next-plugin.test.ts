import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, describe, expect, test } from 'vitest'
import { defineConfig } from '../src/index'
import type { Configuration } from 'webpack'

const fixtures = new Set<string>()

const createFixture = () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'blackwork-docs-next-plugin-'))
  fixtures.add(rootDir)

  const write = (relativePath: string, source: string) => {
    const filePath = join(rootDir, relativePath)
    mkdirSync(dirname(filePath), { recursive: true })
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
    'contents/en/guide/getting-started.mdx',
    `---
title: Getting Started
description: Primary getting started document.
---

# Getting Started
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

describe('withBlackworkDocs', () => {
  test('exports a Next config wrapper from the package next entry', async () => {
    const nextEntry = (await import('@blackwork/docs/next')) as Partial<{
      withBlackworkDocs: unknown
    }>

    expect(typeof nextEntry.withBlackworkDocs).toBe('function')
  })

  test('generates the docs manifest and wires bundler aliases to it', async () => {
    const rootDir = createFixture()
    const { withBlackworkDocs } = (await import('@blackwork/docs/next')) as {
      withBlackworkDocs: (options: {
        config: ReturnType<typeof defineConfig>
        rootDir: string
      }) => (nextConfig?: Record<string, unknown>) => Record<string, unknown>
    }
    const config = defineConfig({
      content: {
        root: 'contents',
        defaultLocale: 'en',
        locales: {
          en: { code: 'en', label: 'English' },
        },
      },
    })

    const nextConfig = withBlackworkDocs({
      config,
      rootDir,
    })({
      images: {
        unoptimized: true,
      },
    })

    expect(nextConfig.turbopack).toMatchObject({
      resolveAlias: {
        'private-blackwork-docs-root/*': './*',
      },
    })
    expect(existsSync(join(rootDir, '.blackwork/docs/manifest.mjs'))).toBe(true)

    const webpackConfig = (
      nextConfig.webpack as NonNullable<Record<string, unknown>['webpack']>
    )(
      {
        resolve: {
          alias: {},
        },
      } as Configuration,
      {
        defaultLoaders: {
          babel: {},
        },
      },
    ) as Configuration

    expect(webpackConfig.resolve?.alias).toMatchObject({
      'private-blackwork-docs-root': rootDir,
    })
  })

  test('auto-discovers a root-level content config when no explicit content is passed', async () => {
    const rootDir = mkdtempSync(
      join(tmpdir(), 'blackwork-docs-next-plugin-auto-'),
    )
    fixtures.add(rootDir)

    const write = (relativePath: string, source: string) => {
      const filePath = join(rootDir, relativePath)
      mkdirSync(dirname(filePath), { recursive: true })
      writeFileSync(filePath, source)
    }

    write(
      'content.config.ts',
      `export const docsContentConfig = {
  root: 'docs',
  defaultLocale: 'zh',
  locales: {
    zh: { code: 'zh', label: '简体中文' },
  },
}
`,
    )

    write(
      'docs/zh/index.mdx',
      `---
title: 概览
description: 从这里开始。
---

# 概览
`,
    )

    const { withBlackworkDocs } = (await import('@blackwork/docs/next')) as {
      withBlackworkDocs: (options: {
        rootDir: string
      }) => (nextConfig?: Record<string, unknown>) => Record<string, unknown>
    }

    withBlackworkDocs({
      rootDir,
    })({})

    const manifestModule = (await import(
      `${pathToFileURL(join(rootDir, '.blackwork/docs/manifest.mjs')).href}?t=${Date.now()}`
    )) as {
      docsManifest: {
        defaultLocale?: string
        localeCodes: string[]
      }
    }

    expect(manifestModule.docsManifest.defaultLocale).toBe('zh')
    expect(manifestModule.docsManifest.localeCodes).toEqual(['zh'])
  })
})
