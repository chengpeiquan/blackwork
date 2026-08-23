import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import test from 'node:test'

test('normalizes CSS entries without changing the stable globals entry', async () => {
  const { normalizeBuildOutput } = await import('../scripts/rename.ts')
  const outDir = await mkdtemp(resolve(tmpdir(), 'blackwork-rename-'))

  try {
    await writeFile(resolve(outDir, 'style.css'), '/* globals */')
    await writeFile(resolve(outDir, 'index.d.ts'), 'export {}')

    await normalizeBuildOutput(outDir)

    assert.equal(
      await readFile(resolve(outDir, 'ui-globals.css'), 'utf8'),
      '/* globals */',
    )
    assert.equal(
      await readFile(resolve(outDir, 'theme.css'), 'utf8'),
      await readFile(resolve('src/styles/theme.css'), 'utf8'),
    )
    assert.equal(
      await readFile(resolve(outDir, 'tailwind.css'), 'utf8'),
      [
        "@import 'tw-animate-css';",
        "@import './theme.css';",
        "@import './ui-globals.css';",
        '@custom-variant dark (&:where(.dark, .dark *));',
        "@source './';",
        '',
      ].join('\n'),
    )
    assert.equal(
      await readFile(resolve(outDir, 'index.d.cts'), 'utf8'),
      'export {}',
    )
  } finally {
    await rm(outDir, { force: true, recursive: true })
  }
})
