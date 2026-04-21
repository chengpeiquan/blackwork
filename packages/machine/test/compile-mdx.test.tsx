import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { compile } from '../src'

const Callout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <aside>{children}</aside>
)

test('compile renders mdx content with passed components', async () => {
  const result = await compile('## Hello\n\n<Callout>World</Callout>', {
    format: 'mdx',
    components: { Callout },
  })

  const html = renderToStaticMarkup(result.jsxElement)

  expect(result.headings[0]?.id).toBe('hello')
  expect(html).toContain('<aside>World</aside>')
})
