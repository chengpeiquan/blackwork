import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from 'vitest'

test('shared sheet uses theme border tokens so dark mode drawers avoid a bright edge', () => {
  const source = readFileSync(
    join(process.cwd(), '../../packages/blackwork/src/components/ui/sheet.tsx'),
    'utf8',
  )

  expect(source).toContain('fixed z-50 gap-4 border-border bg-background')
})
