import { describe, expect, test } from 'vitest'

import { docsContentConfig } from '../../../content.config'

describe('docs site content config', () => {
  test('publishes the first-slice sections', () => {
    expect(docsContentConfig.sections.guide?.layout).toBe('docs')
    expect(docsContentConfig.sections.components?.layout).toBe('docs')
    expect(docsContentConfig.sections.packages).toBeUndefined()
  })

  test('documents site chrome before shadcn primitives', () => {
    const sidebar = docsContentConfig.sections.components?.sidebar
    expect(sidebar).toEqual([
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
    ])
  })

  test('keeps English as the default locale without a prefix', () => {
    expect(docsContentConfig.defaultLocale).toBe('en')
    expect(docsContentConfig.enableDefaultLocaleRedirect).toBe(true)
  })
})
