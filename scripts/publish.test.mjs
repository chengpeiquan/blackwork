import test from 'node:test'
import assert from 'node:assert/strict'

test('creates a publish plan with public access for scoped packages', async () => {
  const { createPublishPlan } = await import('./publish.mjs')

  assert.deepEqual(
    createPublishPlan([
      'docs',
      '--tag',
      'next',
      '--otp',
      '123456',
      '--dry-run',
    ]),
    {
      target: {
        alias: 'docs',
        dir: 'docs',
        packageName: '@blackwork/docs',
        packageDir: 'packages/docs',
      },
      tag: 'next',
      otp: '123456',
      access: 'public',
      dryRun: true,
      skipBuild: false,
    },
  )
})

test('creates a publish plan without forcing access for unscoped packages', async () => {
  const { createPublishPlan } = await import('./publish.mjs')

  assert.deepEqual(createPublishPlan(['ui']), {
    target: {
      alias: 'ui',
      dir: 'blackwork',
      packageName: 'blackwork',
      packageDir: 'packages/blackwork',
    },
    tag: undefined,
    otp: undefined,
    access: undefined,
    dryRun: false,
    skipBuild: false,
  })
})
