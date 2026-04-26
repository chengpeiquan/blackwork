import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

const globalsCss = readFileSync(
  join(process.cwd(), 'src/app/globals.css'),
  'utf8',
)

describe('docs globals css', () => {
  test('excludes not-prose islands from article typography overrides', () => {
    expect(globalsCss).toContain(
      'article :where(h2, h3, h4):not(:where(.not-prose, .not-prose *))',
    )
    expect(globalsCss).toContain(
      'article :where(p, li):not(:where(.not-prose, .not-prose *))',
    )
  })
})
