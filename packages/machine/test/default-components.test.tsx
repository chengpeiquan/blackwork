import { createElement } from 'react'
import { expect, test } from 'vitest'
import { pre } from '../src/runtime/default-components'

test('pre extracts language, raw code, and title for CodeBlock', async () => {
  const element = await pre({
    node: {
      type: 'element',
      tagName: 'pre',
      properties: { 'data-title': 'src/demo.ts' },
      children: [
        {
          type: 'element',
          tagName: 'code',
          properties: { class: ['language-ts'] },
          children: [{ type: 'text', value: 'const foo = 1' }],
        },
      ],
    } as any,
    children: createElement('code', null, 'const foo = 1'),
  })

  expect(element.props.fileName).toBe('src/demo.ts')
  expect(element.props.language).toBe('ts')
  expect(element.props.rawCode).toBe('const foo = 1')
})
