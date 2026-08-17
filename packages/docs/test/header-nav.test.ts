import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, test } from 'vitest'
import { createDocsSource, defineConfig } from '../src/index'
import { buildHeaderNavigation } from '../src/navigation/build-header-nav'

const fixtures = new Set<string>()

const createFixture = () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'blackwork-docs-header-nav-'))
  fixtures.add(rootDir)

  const write = (relativePath: string, source: string) => {
    const filePath = join(rootDir, relativePath)
    mkdirSync(join(filePath, '..'), { recursive: true })
    writeFileSync(filePath, source)
  }

  write(
    'contents/en/index.mdx',
    `---
title: Home
---
# Home
`,
  )
  write(
    'contents/en/guide/index.mdx',
    `---
title: Guide
---
# Guide
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
    'contents/en/components/button.mdx',
    `---
title: Button
---
# Button
`,
  )
  write(
    'contents/zh/guide/index.mdx',
    `---
title: 指南
---
# 指南
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

test('buildHeaderNavigation uses explicit theme.nav labels and locale hrefs', () => {
  const rootDir = createFixture()
  const config = defineConfig({
    content: {
      defaultLocale: 'en',
      locales: {
        en: { code: 'en' },
        zh: { code: 'zh' },
      },
    },
    theme: {
      nav: [
        {
          href: '/guide',
          label: {
            en: 'Guide',
            zh: '指南',
          },
        },
        {
          href: '/components',
          label: 'Components',
        },
      ],
    },
  })
  const source = createDocsSource({ rootDir, config })

  expect(
    buildHeaderNavigation({
      config,
      currentHref: '/guide/getting-started',
      locale: 'en',
      source,
    }),
  ).toEqual([
    { href: '/guide', label: 'Guide', current: true },
    { href: '/components', label: 'Components', current: false },
  ])

  expect(
    buildHeaderNavigation({
      config,
      currentHref: '/zh/guide',
      locale: 'zh',
      source,
    }),
  ).toEqual([
    { href: '/zh/guide', label: '指南', current: true },
    { href: '/zh/components', label: 'Components', current: false },
  ])
})

test('buildHeaderNavigation falls back to content sections when theme.nav is omitted', () => {
  const rootDir = createFixture()
  const config = defineConfig({
    content: {
      defaultLocale: 'en',
      sections: {
        guide: {
          layout: 'docs',
          label: {
            en: 'Guide',
            zh: '指南',
          },
        },
        components: {
          layout: 'docs',
        },
      },
    },
  })
  const source = createDocsSource({ rootDir, config })

  expect(
    buildHeaderNavigation({
      config,
      currentHref: '/components/button',
      locale: 'en',
      source,
    }),
  ).toEqual([
    { href: '/guide', label: 'Guide', current: false },
    { href: '/components', label: 'Components', current: true },
  ])
})

test('buildHeaderNavigation keeps a section landing current on nested pages', () => {
  const rootDir = createFixture()
  const config = defineConfig({
    content: {
      defaultLocale: 'en',
      locales: {
        en: { code: 'en' },
        zh: { code: 'zh' },
      },
    },
    theme: {
      nav: [
        {
          href: '/guide/getting-started',
          label: {
            en: 'Guide',
            zh: '指南',
          },
        },
        {
          href: '/components',
          label: 'Components',
        },
      ],
    },
  })
  const source = createDocsSource({ rootDir, config })

  expect(
    buildHeaderNavigation({
      config,
      currentHref: '/guide/icons',
      locale: 'en',
      source,
    }),
  ).toEqual([
    { href: '/guide/getting-started', label: 'Guide', current: true },
    { href: '/components', label: 'Components', current: false },
  ])
})

test('buildHeaderNavigation can disable the header nav', () => {
  const rootDir = createFixture()
  const config = defineConfig({
    content: {
      defaultLocale: 'en',
      sections: {
        guide: {
          layout: 'docs',
        },
      },
    },
    theme: {
      nav: false,
    },
  })
  const source = createDocsSource({ rootDir, config })

  expect(
    buildHeaderNavigation({
      config,
      currentHref: '/guide',
      locale: 'en',
      source,
    }),
  ).toEqual([])
})
