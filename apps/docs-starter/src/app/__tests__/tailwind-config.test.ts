import { realpathSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, test } from 'vitest'
import tailwindConfig from '../../../tailwind.config'

const content = Array.isArray(tailwindConfig.content)
  ? tailwindConfig.content
  : tailwindConfig.content.files

describe('docs starter tailwind config', () => {
  test('prefers linked workspace package sources over generated dist files', () => {
    const blackworkRoot = realpathSync(
      resolve(process.cwd(), 'node_modules/blackwork'),
    )
    const docsRoot = realpathSync(
      resolve(process.cwd(), 'node_modules/@blackwork/docs'),
    )

    expect(content).toContain(
      join(blackworkRoot, 'src/**/*.{js,mjs,cjs,ts,jsx,tsx,md,mdx}'),
    )
    expect(content).toContain(
      join(docsRoot, 'src/**/*.{js,mjs,cjs,ts,jsx,tsx,md,mdx}'),
    )
    expect(content).not.toContain(join(blackworkRoot, 'dist/**/*.{js,mjs,cjs}'))
    expect(content).not.toContain(join(docsRoot, 'dist/**/*.{js,mjs,cjs}'))
  })
})
