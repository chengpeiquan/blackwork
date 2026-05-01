import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

interface PackageJson {
  exports: Record<string, unknown>
}

const pkg = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8'),
) as PackageJson

describe('@blackwork/machine package exports', () => {
  it('exports the Tailwind CSS entry', () => {
    expect(pkg.exports['./tailwind.css']).toBe('./dist/tailwind.css')
  })
})
