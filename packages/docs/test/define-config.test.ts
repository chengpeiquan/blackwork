import { expect, test } from 'vitest'

test('package exports defineConfig', async () => {
  const module = await import('@blackwork/docs')
  expect(module.defineConfig).toBeTypeOf('function')
})
