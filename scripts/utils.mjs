import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const workspaceDir = resolve(__dirname, '..')

const runPnpmCommand = (args, options = {}) => {
  const npmExecPath = process.env.npm_execpath
  // Standalone pnpm distributions set npm_execpath to a native executable.
  // Only JavaScript CLI entrypoints should be launched through Node.
  const isJavaScriptCli = npmExecPath && /\.[cm]?js$/iu.test(npmExecPath)
  const command = isJavaScriptCli ? process.execPath : npmExecPath || 'pnpm'
  const commandArgs = isJavaScriptCli ? [npmExecPath, ...args] : args

  const result = spawnSync(command, commandArgs, {
    cwd: workspaceDir,
    stdio: 'inherit',
    ...options,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

export { runPnpmCommand, workspaceDir }
