import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('@blackwork/machine Tailwind CSS entry', () => {
  it('declares the package source for Tailwind CSS v4', () => {
    const sourcePath = join(__dirname, '../src/styles/tailwind.css')

    expect(existsSync(sourcePath)).toBe(true)

    const content = readFileSync(sourcePath, 'utf8')
    expect(content).toBe("@source './';\n")
  })
})
