import { describe, expect, test } from 'vitest'

import { docsContentConfig } from '../../../content.config'

describe('docs site content config', () => {
  test('publishes the first-slice sections', () => {
    expect(docsContentConfig.sections.guide?.layout).toBe('docs')
    expect(docsContentConfig.sections.components?.layout).toBe('docs')
    expect('packages' in docsContentConfig.sections).toBe(false)
  })

  test('documents site chrome before shadcn primitives', () => {
    const sidebar = docsContentConfig.sections.components?.sidebar
    expect(sidebar).toEqual([
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
    ])
  })

  test('keeps English as the default locale without a prefix', () => {
    expect(docsContentConfig.defaultLocale).toBe('en')
    expect(docsContentConfig.enableDefaultLocaleRedirect).toBe(true)
  })
})
