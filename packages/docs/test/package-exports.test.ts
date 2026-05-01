import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from 'vitest'

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8'),
) as {
  exports: Record<string, unknown>
}

test('exports Tailwind CSS v4 source entry', () => {
  expect(packageJson.exports['./tailwind.css']).toBe('./dist/tailwind.css')
})
