import { fileURLToPath } from 'node:url'
import { getKnownTargets, resolvePackageTarget } from './package-registry.mjs'
import { runPnpmCommand } from './utils.mjs'

const usage = `Usage:
  pnpm build
  pnpm build <target>
  pnpm build --list

Targets:
${getKnownTargets()}`

const createBuildPlan = (args) => {
  if (args.includes('--list')) {
    return { listOnly: true }
  }

  const [targetInput, ...extraArgs] = args

  if (!targetInput) {
    return { listOnly: false, all: true, extraArgs }
  }

  if (targetInput.startsWith('-')) {
    throw new Error(`Unknown option: ${targetInput}\n\n${usage}`)
  }

  return {
    listOnly: false,
    all: false,
    target: resolvePackageTarget(targetInput),
    extraArgs,
  }
}

const createBuildArgs = (plan) => {
  if (plan.all) {
    return ['exec', 'turbo', 'run', 'build', ...plan.extraArgs]
  }

  return [
    'exec',
    'turbo',
    'run',
    'build',
    '--filter',
    plan.target.packageName,
    ...plan.extraArgs,
  ]
}

const run = (args = process.argv.slice(2), runCommand = runPnpmCommand) => {
  const plan = createBuildPlan(args)

  if (plan.listOnly) {
    console.log(getKnownTargets())
    return
  }

  runCommand(createBuildArgs(plan))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    run()
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

export { createBuildArgs, createBuildPlan, run }
