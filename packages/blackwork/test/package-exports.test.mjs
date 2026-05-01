import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('exports v4 theme CSS without changing v3 entrypoints', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'))

  assert.equal(pkg.exports['./ui-globals.css'], './dist/ui-globals.css')
  assert.equal(pkg.exports['./theme.css'], './dist/theme.css')
  assert.equal(pkg.exports['./tailwind.css'], './dist/tailwind.css')
  assert.ok(pkg.exports['./tailwind-config'])
})
