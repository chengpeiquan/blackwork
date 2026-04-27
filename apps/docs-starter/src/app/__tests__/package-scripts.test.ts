import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
) as {
  scripts?: Record<string, string>
}

describe('docs starter package scripts', () => {
  test('runs the dev server on the documented port', () => {
    expect(packageJson.scripts?.dev).toContain('--port 3200')
  })

  test('keeps separate preview commands for app and static output', () => {
    expect(packageJson.scripts?.start).toContain('.next-build')
    expect(packageJson.scripts?.['start:static']).toContain('.next-static')
  })

  test('builds the Pagefind index as part of the static export flow', () => {
    expect(packageJson.scripts?.['build:search']).toContain(
      './scripts/build-search-index.mjs',
    )
    expect(packageJson.scripts?.['build:static']).toContain(
      'pnpm run build:search',
    )
  })
})
