import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, describe, expect, test } from 'vitest'
import { defineConfig } from '../src/index'
import { generateDocsManifestFiles } from '../src/next-plugin/generate'

const fixtures = new Set<string>()

const createFixture = () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'blackwork-docs-manifest-'))
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
order: 1
---

# Overview
`,
  )

  write(
    'contents/en/guide/getting-started.mdx',
    `---
title: Getting Started
description: Primary getting started document.
order: 2
---

# Getting Started

Alpha
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

  return {
    rootDir,
    write,
  }
}

afterEach(() => {
  for (const fixture of fixtures) {
    rmSync(fixture, { recursive: true, force: true })
  }

  fixtures.clear()
})

describe('generateDocsManifestFiles', () => {
  test('emits generated content modules and a manifest that can load source content', async () => {
    const { rootDir } = createFixture()
    const config = defineConfig({
      content: {
        root: 'contents',
        defaultLocale: 'en',
        locales: {
          en: { code: 'en', label: 'English' },
          zh: { code: 'zh', label: '简体中文' },
        },
      },
    })

    const output = await generateDocsManifestFiles({
      rootDir,
      config,
    })

    expect(existsSync(output.manifestPath)).toBe(true)
    expect(existsSync(output.contentModulesDir)).toBe(true)
    expect(readFileSync(output.manifestPath, 'utf8')).toContain('loadSource')

    const imported = (await import(
      `${pathToFileURL(output.manifestPath).href}?t=${Date.now()}`
    )) as {
      docsManifest: {
        entries: Array<{
          href: string
          loadSource: () => Promise<string>
        }>
      }
    }

    expect(imported.docsManifest.entries.map((entry) => entry.href)).toEqual([
      '/',
      '/guide/getting-started',
      '/zh',
    ])
    await expect(
      imported.docsManifest.entries[1]?.loadSource(),
    ).resolves.toContain('# Getting Started')
  })

  test('rebuilds the generated manifest when docs files are removed', async () => {
    const { rootDir } = createFixture()
    const config = defineConfig({
      content: {
        root: 'contents',
        defaultLocale: 'en',
        locales: {
          en: { code: 'en', label: 'English' },
          zh: { code: 'zh', label: '简体中文' },
        },
      },
    })

    const first = await generateDocsManifestFiles({
      rootDir,
      config,
    })
    const before = (await import(
      `${pathToFileURL(first.manifestPath).href}?t=before-${Date.now()}`
    )) as {
      docsManifest: {
        entries: Array<{ href: string }>
      }
    }

    unlinkSync(join(rootDir, 'contents/en/guide/getting-started.mdx'))

    const next = await generateDocsManifestFiles({
      rootDir,
      config,
    })
    const after = (await import(
      `${pathToFileURL(next.manifestPath).href}?t=after-${Date.now()}`
    )) as {
      docsManifest: {
        entries: Array<{ href: string }>
      }
    }

    expect(before.docsManifest.entries.map((entry) => entry.href)).toContain(
      '/guide/getting-started',
    )
    expect(after.docsManifest.entries.map((entry) => entry.href)).not.toContain(
      '/guide/getting-started',
    )
  })
})
