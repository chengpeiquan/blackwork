import { type DocsContentConfig } from '@blackwork/docs'

export const docsContentConfig = {
  root: 'src/contents',
  defaultLocale: 'en',
  enableDefaultLocaleRedirect: true,
  locales: {
    en: {
      code: 'en',
      lang: 'en-US',
      label: 'English',
    },
    zh: {
      code: 'zh',
      lang: 'zh-CN',
      label: '简体中文',
    },
  },
  sections: {
    guide: {
      layout: 'docs',
      sidebar: [
        {
          type: 'group',
          label: {
            en: 'Start here',
            zh: '从这里开始',
          },
          items: [
            { type: 'item', href: '/guide/getting-started' },
            { type: 'item', href: '/guide/icons' },
            { type: 'item', href: '/guide/migration' },
          ],
        },
      ],
    },
    components: {
      layout: 'docs',
      sidebar: [
        {
          type: 'group',
          label: {
            en: 'Site chrome',
            zh: '站点框架',
          },
          items: [
            { type: 'item', href: '/components' },
            {
              type: 'item',
              href: '/components/layouts',
              label: { en: 'Layouts', zh: '布局' },
            },
            {
              type: 'item',
              href: '/components/widgets',
              label: { en: 'Widgets', zh: '小工具' },
            },
            {
              type: 'item',
              href: '/components/theme',
              label: { en: 'Theme', zh: '主题' },
            },
          ],
        },
        {
          type: 'group',
          label: {
            en: 'Components',
            zh: '组件',
          },
          items: [
            { type: 'item', href: '/components/button' },
            { type: 'item', href: '/components/dialog' },
            { type: 'item', href: '/components/field' },
            { type: 'item', href: '/components/form' },
            { type: 'item', href: '/components/sheet' },
          ],
        },
      ],
    },
  },
} satisfies DocsContentConfig
