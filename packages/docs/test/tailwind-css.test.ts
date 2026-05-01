import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from 'vitest'

test('docs Tailwind CSS entry exposes only docs package sources', () => {
  const source = readFileSync(
    join(__dirname, '../src/styles/tailwind.css'),
    'utf8',
  )

  expect(source).toBe("@source './';\n")
})
