import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const utilsUrl = new URL('../utils.mjs', import.meta.url).href

const runCli = (npmExecPath, args) =>
  spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `import { runPnpmCommand } from ${JSON.stringify(utilsUrl)};
       runPnpmCommand(JSON.parse(process.argv[1]));`,
      JSON.stringify(args),
    ],
    {
      encoding: 'utf8',
      env: { ...process.env, npm_execpath: npmExecPath },
    },
  )

test('launches a native executable directly and preserves arguments', () => {
  const result = runCli(process.execPath, [
    '-e',
    'console.log(JSON.stringify(process.argv.slice(1)))',
    'argument with spaces',
  ])

  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(JSON.parse(result.stdout), ['argument with spaces'])
})

test('launches JavaScript CLI entrypoints through Node', () => {
  const directory = mkdtempSync(join(tmpdir(), 'blackwork-cli-'))

  try {
    for (const extension of ['js', 'cjs', 'mjs']) {
      const cliPath = join(directory, `pnpm.${extension}`)
      writeFileSync(
        cliPath,
        'console.log(JSON.stringify(process.argv.slice(2)))',
      )

      const result = runCli(cliPath, ['--filter', 'blackwork', 'build'])

      assert.equal(result.status, 0, result.stderr)
      assert.deepEqual(JSON.parse(result.stdout), [
        '--filter',
        'blackwork',
        'build',
      ])
    }
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

test('propagates the CLI exit code', () => {
  const result = runCli(process.execPath, ['-e', 'process.exit(7)'])

  assert.equal(result.status, 7)
})
