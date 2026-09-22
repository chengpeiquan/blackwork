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
            {
              type: 'item',
              href: '/guide/getting-started',
              label: { en: 'Getting started', zh: '快速开始' },
            },
            {
              type: 'item',
              href: '/guide/icons',
              label: { en: 'Icons', zh: '图标' },
            },
            {
              type: 'item',
              href: '/guide/skills',
              label: { en: 'Skills', zh: 'Skill' },
            },
            {
              type: 'item',
              href: '/guide/migration',
              label: { en: 'Migration', zh: '迁移指南' },
            },
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
            en: 'Site structure',
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
            en: 'Effects',
            zh: '效果',
          },
          items: [{ type: 'item', href: '/components/glass' }],
        },
        {
          type: 'group',
          label: {
            en: 'Components',
            zh: '组件',
          },
          items: [
            {
              type: 'item',
              href: '/components/button',
              label: { en: 'Button', zh: '按钮' },
            },
            {
              type: 'item',
              href: '/components/dialog',
              label: { en: 'Dialog', zh: '对话框' },
            },
            {
              type: 'item',
              href: '/components/field',
              label: { en: 'Field', zh: '字段' },
            },
            {
              type: 'item',
              href: '/components/form',
              label: { en: 'Form', zh: '表单' },
            },
            {
              type: 'item',
              href: '/components/sheet',
              label: { en: 'Sheet', zh: '侧边面板' },
            },
            {
              type: 'item',
              href: '/components/top-progress',
              label: { en: 'Top progress', zh: '顶部进度条' },
            },
          ],
        },
      ],
    },
  },
} satisfies DocsContentConfig
