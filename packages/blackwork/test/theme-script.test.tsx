import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { ThemeScript } from '../src/components/theme/theme-script'

test('keeps the inline theme script executable when rendered on the server', () => {
  const html = renderToStaticMarkup(<ThemeScript />)

  expect(html).toContain('blackwork-theme')
  expect(html).not.toContain('type="text/plain"')
})
