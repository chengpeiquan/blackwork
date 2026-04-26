import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getKnownTargets, resolvePackageTarget } from './package-registry.mjs'
import { runPnpmCommand, workspaceDir } from './utils.mjs'

const usage = `Usage:
  pnpm gen:changelog <target> [-- <extra changelog args>]
  pnpm gen:changelog --list

Targets:
${getKnownTargets()}`

const createChangelogPlan = (args) => {
  if (args.includes('--list')) {
    return { listOnly: true }
  }

  const [targetInput, ...extraArgs] = args

  if (!targetInput || targetInput.startsWith('-')) {
    throw new Error(`Missing package target.\n\n${usage}`)
  }

  return {
    listOnly: false,
    target: resolvePackageTarget(targetInput),
    extraArgs,
  }
}

const run = (args = process.argv.slice(2)) => {
  const plan = createChangelogPlan(args)

  if (plan.listOnly) {
    console.log(getKnownTargets())
    return
  }

  runPnpmCommand(['exec', 'changelog', ...plan.extraArgs], {
    cwd: resolve(workspaceDir, plan.target.packageDir),
  })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    run()
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

export { createChangelogPlan, run }
