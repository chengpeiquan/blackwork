import { describe, expect, test } from 'vitest'
import { defineConfig } from '../src/config/define-config'
import { resolveDocumentLang } from '../src/next/resolve-document-lang'

const config = defineConfig({
  content: {
    defaultLocale: 'en',
    locales: {
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
    },
  },
})

describe('resolveDocumentLang', () => {
  test('uses the default locale lang for canonical default-locale routes', () => {
    expect(
      resolveDocumentLang({
        config,
        pathname: '/guide/getting-started',
      }),
    ).toBe('en-US')
  })

  test('uses the path-prefixed locale lang for non-default locale routes', () => {
    expect(
      resolveDocumentLang({
        config,
        pathname: '/zh/guide/getting-started',
      }),
    ).toBe('zh-CN')
  })
})
