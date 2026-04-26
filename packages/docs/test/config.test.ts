import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, expect, test } from 'vitest'
import type {
  DocsConfig,
  DocsLocaleDefinition,
  NormalizedDocsConfig,
} from '../src/index'

type DefineConfig = typeof import('../src/index').defineConfig
type DefineDocsConfig = typeof import('../src/index').defineDocsConfig

const fixtures = new Set<string>()

const createFixture = () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'blackwork-docs-config-'))
  fixtures.add(rootDir)

  const write = (relativePath: string, source: string) => {
    const filePath = join(rootDir, relativePath)
    mkdirSync(dirname(filePath), { recursive: true })
    writeFileSync(filePath, source)
  }

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

const locales: Record<string, DocsLocaleDefinition> = {
  en: {
    code: 'en',
    label: 'English',
    lang: 'en-US',
  },
  zh: {
    code: 'zh',
    label: '简体中文',
    lang: 'zh-CN',
  },
}

test('defineConfig returns a normalized config shape', async () => {
  const { defineConfig } = await import('@blackwork/docs')
  const typedDefineConfig: DefineConfig = defineConfig

  const config: DocsConfig = {
    site: {
      title: 'Blackwork Docs',
    },
    content: {
      defaultLocale: 'en',
      locales,
    },
    theme: {
      accentColor: 'amber',
    },
  }
  const normalized: NormalizedDocsConfig = typedDefineConfig(config)

  expect(normalized).toEqual({
    site: {
      title: 'Blackwork Docs',
    },
    content: {
      root: 'contents',
      defaultLocale: 'en',
      enableDefaultLocaleRedirect: true,
      locales,
    },
    theme: {
      accentColor: 'amber',
    },
    docs: {},
    home: {},
    mdx: {},
    slots: {},
  })
})

test('defineConfig applies the default content root', async () => {
  const { defineConfig } = await import('@blackwork/docs')
  const typedDefineConfig: DefineConfig = defineConfig

  expect(typedDefineConfig({}).content.root).toBe('contents')
})

test('defineConfig preserves the default content root when explicitly undefined', async () => {
  const { defineConfig } = await import('@blackwork/docs')
  const typedDefineConfig: DefineConfig = defineConfig

  expect(
    typedDefineConfig({
      content: {
        root: undefined,
      },
    }).content.root,
  ).toBe('contents')
})

test('defineConfig preserves content defaultLocale', async () => {
  const { defineConfig } = await import('@blackwork/docs')
  const typedDefineConfig: DefineConfig = defineConfig
  const config: DocsConfig = {
    content: {
      defaultLocale: 'zh',
    },
  }

  expect(typedDefineConfig(config).content.defaultLocale).toBe('zh')
})

test('defineConfig preserves content locales', async () => {
  const { defineConfig } = await import('@blackwork/docs')
  const typedDefineConfig: DefineConfig = defineConfig
  const config: DocsConfig = {
    content: {
      locales,
    },
  }

  expect(typedDefineConfig(config).content.locales).toEqual(locales)
})

test('defineConfig normalizes content sections for docs and content layouts', async () => {
  const { defineConfig } = await import('@blackwork/docs')
  const typedDefineConfig: DefineConfig = defineConfig

  const config = typedDefineConfig({
    content: {
      sections: {
        guide: {
          layout: 'docs',
        },
        article: {
          layout: 'content',
        },
      },
    },
  })

  expect(config.content.sections).toEqual({
    guide: {
      layout: 'docs',
      sidebar: 'auto',
    },
    article: {
      layout: 'content',
      sidebar: false,
    },
  })
})

test('defineConfig accepts manual sidebar trees for docs sections', async () => {
  const { defineConfig } = await import('@blackwork/docs')
  const typedDefineConfig: DefineConfig = defineConfig

  const config = {
    content: {
      sections: {
        guide: {
          layout: 'docs',
          sidebar: [
            {
              type: 'group',
              label: {
                en: 'Guide',
                zh: '指南',
              },
              items: [
                {
                  type: 'item',
                  href: '/guide/getting-started',
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
  } satisfies DocsConfig

  expect(typedDefineConfig(config).content.sections).toEqual({
    guide: {
      layout: 'docs',
      sidebar: [
        {
          type: 'group',
          label: {
            en: 'Guide',
            zh: '指南',
          },
          items: [
            {
              type: 'item',
              href: '/guide/getting-started',
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
  })
})

test('defineConfig enables default-locale redirects by default', async () => {
  const { defineConfig } = await import('@blackwork/docs')
  const typedDefineConfig: DefineConfig = defineConfig

  expect(typedDefineConfig({}).content.enableDefaultLocaleRedirect).toBe(true)
})

test('defineConfig preserves an explicit default-locale redirect flag', async () => {
  const { defineConfig } = await import('@blackwork/docs')
  const typedDefineConfig: DefineConfig = defineConfig

  const config = typedDefineConfig({
    content: {
      enableDefaultLocaleRedirect: false,
    },
  })

  expect(config.content.enableDefaultLocaleRedirect).toBe(false)
})

test('defineConfig accepts mdx components and slots', async () => {
  const { defineConfig } = await import('@blackwork/docs')
  const typedDefineConfig: DefineConfig = defineConfig

  const components = {
    pre: 'Pre',
    table: 'Table',
  }
  const slots = {
    announcement: 'Announcement',
    footer: 'Footer',
  }

  const config = typedDefineConfig({
    mdx: {
      components,
    },
    slots,
  })

  expect(config.mdx.components).toEqual(components)
  expect(config.slots).toEqual(slots)
})

test('defineDocsConfig loads content from a root-level named export', async () => {
  const fixture = createFixture()
  fixture.write(
    'content.config.ts',
    `export const docsContentConfig = {
  root: 'src/content',
  defaultLocale: 'en',
  locales: {
    en: { code: 'en', label: 'English' },
    zh: { code: 'zh', label: '简体中文' },
  },
}
`,
  )

  const { defineDocsConfig } = await import('@blackwork/docs')
  const typedDefineDocsConfig: DefineDocsConfig = defineDocsConfig

  const config = typedDefineDocsConfig(
    {
      site: {
        title: 'Named Export Docs',
      },
    },
    {
      rootDir: fixture.rootDir,
    },
  )

  expect(config.site.title).toBe('Named Export Docs')
  expect(config.content).toEqual({
    root: 'src/content',
    defaultLocale: 'en',
    enableDefaultLocaleRedirect: true,
    locales: {
      en: { code: 'en', label: 'English' },
      zh: { code: 'zh', label: '简体中文' },
    },
  })
})

test('defineDocsConfig supports default exports and inline content overrides', async () => {
  const fixture = createFixture()
  fixture.write(
    'content.config.ts',
    `export default {
  root: 'src/content',
  defaultLocale: 'en',
  locales: {
    en: { code: 'en', label: 'English' },
    zh: { code: 'zh', label: '简体中文' },
  },
}
`,
  )

  const { defineDocsConfig } = await import('@blackwork/docs')
  const typedDefineDocsConfig: DefineDocsConfig = defineDocsConfig

  const config = typedDefineDocsConfig(
    {
      content: {
        defaultLocale: 'zh',
      },
    },
    {
      rootDir: fixture.rootDir,
    },
  )

  expect(config.content).toEqual({
    root: 'src/content',
    defaultLocale: 'zh',
    enableDefaultLocaleRedirect: true,
    locales: {
      en: { code: 'en', label: 'English' },
      zh: { code: 'zh', label: '简体中文' },
    },
  })
})

test('defineDocsConfig loads section rules from content config and allows inline section overrides', async () => {
  const fixture = createFixture()
  fixture.write(
    'content.config.ts',
    `export const docsContentConfig = {
  root: 'src/content',
  sections: {
    guide: {
      layout: 'docs',
    },
    article: {
      layout: 'content',
    },
  },
}
`,
  )

  const { defineDocsConfig } = await import('@blackwork/docs')
  const typedDefineDocsConfig: DefineDocsConfig = defineDocsConfig

  const config = typedDefineDocsConfig(
    {
      content: {
        sections: {
          article: {
            layout: 'docs',
          },
        },
      },
    },
    {
      rootDir: fixture.rootDir,
    },
  )

  expect(config.content.sections).toEqual({
    guide: {
      layout: 'docs',
      sidebar: 'auto',
    },
    article: {
      layout: 'docs',
      sidebar: 'auto',
    },
  })
})

test('defineDocsConfig preserves manual sidebar trees loaded from content.config.ts', async () => {
  const fixture = createFixture()
  fixture.write(
    'content.config.ts',
    `export const docsContentConfig = {
  root: 'src/content',
  sections: {
    guide: {
      layout: 'docs',
      sidebar: [
        {
          type: 'group',
          label: {
            en: 'Guide',
            zh: '指南',
          },
          items: [
            {
              type: 'item',
              href: '/guide/getting-started',
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
}
`,
  )

  const { defineDocsConfig } = await import('@blackwork/docs')
  const typedDefineDocsConfig: DefineDocsConfig = defineDocsConfig

  const config = typedDefineDocsConfig(
    {
      content: {
        sections: {
          guide: {
            layout: 'docs',
          },
          article: {
            layout: 'docs',
          },
        },
      },
    },
    {
      rootDir: fixture.rootDir,
    },
  )

  expect(config.content.sections).toEqual({
    guide: {
      layout: 'docs',
      sidebar: [
        {
          type: 'group',
          label: {
            en: 'Guide',
            zh: '指南',
          },
          items: [
            {
              type: 'item',
              href: '/guide/getting-started',
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
    article: {
      layout: 'docs',
      sidebar: 'auto',
    },
  })
})

test('defineDocsConfig falls back to defineConfig defaults when content.config.ts is absent', async () => {
  const fixture = createFixture()
  const { defineDocsConfig } = await import('@blackwork/docs')
  const typedDefineDocsConfig: DefineDocsConfig = defineDocsConfig

  expect(
    typedDefineDocsConfig(
      {
        site: {
          title: 'Fallback Docs',
        },
      },
      {
        rootDir: fixture.rootDir,
      },
    ),
  ).toEqual({
    site: {
      title: 'Fallback Docs',
    },
    content: {
      root: 'contents',
      enableDefaultLocaleRedirect: true,
    },
    theme: {},
    docs: {},
    home: {},
    mdx: {},
    slots: {},
  })
})
