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

test('compile applies a fixed black letterbox class to markdown videos', async () => {
  const result = await compile(`:::video
https://example.com/demo.mp4
https://example.com/poster.jpg
Demo title
:::`)

  expect(result.html).toContain('src="https://example.com/demo.mp4"')
  expect(result.html).toContain('aspect-video')
  expect(result.html).toContain('bg-black')
  expect(result.html).toContain('object-contain')
  expect(result.html).not.toContain('object-fill')
})

test('compile accepts a markdown video aspect attribute', async () => {
  const result = await compile(`:::video{aspect="4/3"}
https://example.com/demo.mp4
https://example.com/poster.jpg
Demo title
:::`)

  expect(result.html).toContain('style="aspect-ratio: 4 / 3"')
  expect(result.html).toContain('bg-black')
  expect(result.html).toContain('object-contain')
  expect(result.html).not.toContain('aspect-video')
})

test('compile accepts a colon-separated video aspect and extra class', async () => {
  const result = await compile(`:::video{aspect="4:3" class="shadow-md"}
https://example.com/demo.mp4
https://example.com/poster.jpg
Demo title
:::`)

  expect(result.html).toContain('style="aspect-ratio: 4 / 3"')
  expect(result.html).toContain('shadow-md')
  expect(result.html).not.toContain('aspect-video')
})

test('compile keeps the default 16:9 video class for an invalid aspect', async () => {
  const result = await compile(`:::video{aspect="wide"}
https://example.com/demo.mp4
https://example.com/poster.jpg
Demo title
:::`)

  expect(result.html).toContain('aspect-video')
  expect(result.html).not.toContain('aspect-ratio:')
})
