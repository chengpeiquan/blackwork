import { type DocsContentConfig } from '@blackwork/docs'

export const docsContentConfig = {
  root: 'src/contents',
  defaultLocale: 'en',
  enableDefaultLocaleRedirect: true,
  locales: {
    en: {
      code: 'en',
      label: 'English',
    },
    zh: {
      code: 'zh',
      label: '简体中文',
    },
  },
  sections: {
    // Use a docs-style section when readers should move through pages in a
    // curated order with a left sidebar.
    guide: {
      layout: 'docs',
      sidebar: [
        {
          type: 'group',
          label: {
            en: 'Learn The Setup',
            zh: '学习配置方式',
          },
          items: [
            {
              type: 'item',
              href: '/guide',
            },
            {
              type: 'item',
              href: '/guide/getting-started',
              label: {
                en: 'Quickstart',
                zh: '快速开始',
              },
            },
            {
              type: 'item',
              href: '/guide/configuring-sections',
              label: {
                en: 'Configuring Sections',
                zh: '配置 Sections',
              },
            },
          ],
        },
        {
          type: 'group',
          label: {
            en: 'Examples',
            zh: '示例',
          },
          items: [
            {
              type: 'item',
              href: '/guide/mdx-playground',
              label: {
                en: 'MDX Playground',
                zh: 'MDX 组件演示',
              },
            },
            {
              type: 'item',
              href: '/reference/configuration',
              label: {
                en: 'Configuration Reference',
                zh: '配置参考',
              },
            },
          ],
        },
      ],
    },
    // Use a content-style section for pages readers usually open directly from
    // search, links, or bookmarks. The docs sidebar is omitted here.
    reference: {
      layout: 'content',
    },
  },
} satisfies DocsContentConfig
