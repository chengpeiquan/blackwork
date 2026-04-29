import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { CodeBlock } from '../src'

test('CodeBlock renders language label and file name', () => {
  const html = renderToStaticMarkup(
    <CodeBlock fileName="src/demo.ts" language="ts" rawCode="const foo = 1">
      <code>const foo = 1</code>
    </CodeBlock>,
  )

  expect(html).toContain('src/demo.ts')
  expect(html).toContain('TypeScript')
})

test('CodeBlock keeps blog visual treatment and supports vue language labels', () => {
  const html = renderToStaticMarkup(
    <CodeBlock
      fileName="docs/.vitepress/config.ts"
      language="vue"
      rawCode="<template />"
    >
      <code>&lt;template /&gt;</code>
    </CodeBlock>,
  )

  expect(html).toContain('border-border')
  expect(html).toContain('bg-card')
  expect(html).toContain('bg-muted/40')
  expect(html).toContain('dark:border-zinc-800')
  expect(html).toContain('dark:bg-zinc-950')
  expect(html).toContain('dark:bg-zinc-950/80')
  expect(html).toContain('>Vue</span>')
  expect(html).not.toContain(
    'rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground',
  )
})

test('markdown code blocks wrap long lines without forcing all code blocks to wrap', () => {
  const markdownHtml = renderToStaticMarkup(
    <CodeBlock
      language="markdown"
      rawCode={'# ' + 'very-long-line '.repeat(20)}
    >
      <code># test</code>
    </CodeBlock>,
  )

  const typescriptHtml = renderToStaticMarkup(
    <CodeBlock language="ts" rawCode={'const value = "' + 'x'.repeat(80) + '"'}>
      <code>const value = &quot;test&quot;</code>
    </CodeBlock>,
  )

  expect(markdownHtml).toContain('overflow-x-hidden')
  expect(markdownHtml).toContain('whitespace-pre-wrap')
  expect(markdownHtml).toContain('[&amp;_code]:whitespace-pre-wrap')
  expect(typescriptHtml).toContain('overflow-x-auto')
  expect(typescriptHtml).not.toContain('whitespace-pre-wrap')
})
