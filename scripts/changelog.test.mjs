import test from 'node:test'
import assert from 'node:assert/strict'

test('creates changelog args with the package tag prefix by default', async () => {
  const { createChangelogArgs, createChangelogPlan } =
    await import('./changelog.mjs')

  assert.deepEqual(createChangelogArgs(createChangelogPlan(['docs'])), [
    'exec',
    'changelog',
    '--lerna-package',
    'docs',
  ])
})

test('preserves explicit changelog args after the package tag prefix', async () => {
  const { createChangelogArgs, createChangelogPlan } =
    await import('./changelog.mjs')

  assert.deepEqual(
    createChangelogArgs(
      createChangelogPlan(['machine', '--release-count', '0']),
    ),
    ['exec', 'changelog', '--lerna-package', 'machine', '--release-count', '0'],
  )
})
