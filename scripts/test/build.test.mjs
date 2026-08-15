import test from 'node:test'
import assert from 'node:assert/strict'

test('builds the whole workspace when no target is given', async () => {
  const { createBuildArgs, createBuildPlan } = await import('../build.mjs')

  assert.deepEqual(createBuildArgs(createBuildPlan([])), [
    'exec',
    'turbo',
    'run',
    'build',
  ])
})

test('builds a single package through turbo filter', async () => {
  const { createBuildArgs, createBuildPlan } = await import('../build.mjs')

  assert.deepEqual(createBuildArgs(createBuildPlan(['machine'])), [
    'exec',
    'turbo',
    'run',
    'build',
    '--filter',
    '@blackwork/machine',
  ])
})

test('preserves extra turbo args after the package target', async () => {
  const { createBuildArgs, createBuildPlan } = await import('../build.mjs')

  assert.deepEqual(createBuildArgs(createBuildPlan(['docs', '--force'])), [
    'exec',
    'turbo',
    'run',
    'build',
    '--filter',
    '@blackwork/docs',
    '--force',
  ])
})

test('lists known package targets', async () => {
  const logs = []
  const originalLog = console.log
  const { run } = await import('../build.mjs')

  console.log = (value) => {
    logs.push(value)
  }

  try {
    run(['--list'])
  } finally {
    console.log = originalLog
  }

  assert.match(logs.join('\n'), /machine -> @blackwork\/machine/)
})
