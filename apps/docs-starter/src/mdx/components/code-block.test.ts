import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { DocsCodeBlock } from './code-block'

test('DocsCodeBlock lets shiki backgrounds span the full horizontal scroll width', () => {
  const html = renderToStaticMarkup(
    React.createElement(
      DocsCodeBlock,
      null,
      React.createElement(
        'code',
        { className: 'language-ts' },
        'const veryLongIdentifier = true;',
      ),
    ),
  )

  expect(html).toContain('data-docs-region="mdx-code-block"')
  expect(html).toContain('min-w-full w-max')
})
