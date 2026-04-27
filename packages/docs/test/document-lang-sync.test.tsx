/**
 * @vitest-environment jsdom
 */

import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineConfig } from '../src/config/define-config'

const { usePathname } = vi.hoisted(() => ({
  usePathname: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname,
}))

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

describe('DocsDocumentLangSync', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    document.documentElement.lang = 'en-US'
  })

  afterEach(() => {
    container.remove()
    vi.clearAllMocks()
  })

  test('updates document.documentElement.lang from the current pathname locale after hydration', async () => {
    usePathname.mockReturnValue('/zh/guide/getting-started')

    const { DocsDocumentLangSync } =
      await import('../src/next/document-lang-sync')
    const root = createRoot(container)

    await act(async () => {
      root.render(<DocsDocumentLangSync content={config.content} />)
    })

    expect(document.documentElement.lang).toBe('zh-CN')

    await act(async () => {
      root.unmount()
    })
  })
})
