import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('exports the Tailwind v4 CSS entries only', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'))

  assert.equal(pkg.exports['./ui-globals.css'], './dist/ui-globals.css')
  assert.equal(pkg.exports['./theme.css'], './dist/theme.css')
  assert.equal(pkg.exports['./tailwind.css'], './dist/tailwind.css')
  assert.equal(pkg.exports['./tailwind-config'], undefined)
  assert.equal(pkg.peerDependencies.tailwindcss, '>=4.0.0')
})
