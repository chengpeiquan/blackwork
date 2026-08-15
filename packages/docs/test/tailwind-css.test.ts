import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from 'vitest'

test('docs Tailwind CSS entry exposes package sources and fixed video letterbox styles', () => {
  const source = readFileSync(
    join(__dirname, '../src/styles/tailwind.css'),
    'utf8',
  )

  expect(source).toContain("@source './';")
  expect(source).toContain(':where(video)')
  expect(source).not.toContain('figure :where(video)')
  expect(source).toContain('background-color: #000')
  expect(source).toContain('object-fit: contain')
  expect(source).not.toContain('object-fit: fill')
})
