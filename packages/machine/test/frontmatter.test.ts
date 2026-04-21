import { expect, test } from 'vitest'
import { parseFrontmatter } from '../src'

test('parseFrontmatter extracts data and body from markdown source', () => {
  const result = parseFrontmatter(`---
title: Hello
desc: World
---

Body`)

  expect(result.frontmatter.title).toBe('Hello')
  expect(result.body.trim()).toBe('Body')
})
