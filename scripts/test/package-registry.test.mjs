import test from 'node:test'
import assert from 'node:assert/strict'

test('resolves package aliases and package names', async () => {
  const { resolvePackageTarget } = await import('../package-registry.mjs')

  assert.deepEqual(resolvePackageTarget('ui'), {
    alias: 'ui',
    dir: 'blackwork',
    packageName: 'blackwork',
    packageDir: 'packages/blackwork',
  })

  assert.deepEqual(resolvePackageTarget('machine'), {
    alias: 'machine',
    dir: 'machine',
    packageName: '@blackwork/machine',
    packageDir: 'packages/machine',
  })

  assert.deepEqual(resolvePackageTarget('@blackwork/docs'), {
    alias: 'docs',
    dir: 'docs',
    packageName: '@blackwork/docs',
    packageDir: 'packages/docs',
  })

  assert.deepEqual(resolvePackageTarget('@blackwork/search'), {
    alias: 'search',
    dir: 'search',
    packageName: '@blackwork/search',
    packageDir: 'packages/search',
  })
})

test('throws with a helpful error for unknown packages', async () => {
  const { resolvePackageTarget } = await import('../package-registry.mjs')

  assert.throws(() => resolvePackageTarget('unknown'), {
    message: /Unknown package target/u,
  })
})
