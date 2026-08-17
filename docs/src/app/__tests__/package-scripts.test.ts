import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
) as {
  scripts?: Record<string, string>
}

describe('docs site package scripts', () => {
  test('runs the preview server on the documented port', () => {
    expect(packageJson.scripts?.dev).toContain('--port 3300')
  })

  test('treats the production build as a static export', () => {
    expect(packageJson.scripts?.build).toContain('NEXT_OUTPUT=export')
    expect(packageJson.scripts?.build).toContain('.next-static')
    expect(packageJson.scripts?.build).toContain('pnpm run build:search')
    expect(packageJson.scripts?.start).toContain('start:static')
  })

  test('builds the Pagefind index as part of the static export flow', () => {
    expect(packageJson.scripts?.['build:search']).toContain(
      './scripts/build-search-index.mjs',
    )
  })
})
