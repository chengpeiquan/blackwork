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
})
