import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { ThemeToggle } from '../src/components/theme/theme-toggle'

test('uses the configured theme label for visible accessibility text', () => {
  const html = renderToStaticMarkup(
    <ThemeToggle title="切换主题" ariaLabel="切换主题" />,
  )

  expect(html).toContain('aria-label="切换主题"')
  expect(html).toContain('>切换主题</span>')
  expect(html).not.toContain('Toggle Language')
})
