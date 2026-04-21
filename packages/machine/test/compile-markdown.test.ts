import { expect, test } from 'vitest'
import { compile } from '../src'

test('compile returns headings, html, and code block title metadata for markdown', async () => {
  const result = await compile(`---
title: Test
desc: Demo
---

## Hello {#hello}

\`\`\`ts title="src/demo.ts"
const foo = 1
\`\`\`
`)

  expect(result.frontmatter.title).toBe('Test')
  expect(result.headings[0]?.id).toBe('hello')
  expect(result.html).toContain('data-title="src/demo.ts"')
  expect(result.html).toContain('class="language-ts"')
})
