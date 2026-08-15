import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getKnownTargets, resolvePackageTarget } from './package-registry.mjs'
import { runPnpmCommand, workspaceDir } from './utils.mjs'

const usage = `Usage:
  pnpm publish <target> [--tag <tag>] [--otp <otp>] [--access <access>] [--dry-run] [--skip-build]

Targets:
${getKnownTargets()}`

const getOptionValue = (args, index, optionName) => {
  const value = args[index + 1]

  if (!value || value.startsWith('-')) {
    throw new Error(`Missing value for ${optionName}.\n\n${usage}`)
  }

  return value
}

const createPublishPlan = (args) => {
  let targetInput
  let tag
  let otp
  let access
  let dryRun = false
  let skipBuild = false

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index]

    switch (token) {
      case '--tag':
        tag = getOptionValue(args, index, '--tag')
        index += 1
        break

      case '--otp':
        otp = getOptionValue(args, index, '--otp')
        index += 1
        break

      case '--access':
        access = getOptionValue(args, index, '--access')
        index += 1
        break

      case '--dry-run':
        dryRun = true
        break

      case '--skip-build':
        skipBuild = true
        break

      default:
        if (!token.startsWith('-') && !targetInput) {
          targetInput = token
          break
        }

        throw new Error(`Unknown option: ${token}\n\n${usage}`)
    }
  }

  if (!targetInput) {
    throw new Error(`Missing package target.\n\n${usage}`)
  }

  const target = resolvePackageTarget(targetInput)

  return {
    target,
    tag,
    otp,
    access:
      access ?? (target.packageName.startsWith('@') ? 'public' : undefined),
    dryRun,
    gitChecks: false,
    skipBuild,
  }
}

const createPublishArgs = (plan) => {
  const publishArgs = ['publish']

  if (plan.access) {
    publishArgs.push('--access', plan.access)
  }

  if (plan.tag) {
    publishArgs.push('--tag', plan.tag)
  }

  if (plan.otp) {
    publishArgs.push('--otp', plan.otp)
  }

  if (plan.dryRun) {
    publishArgs.push('--dry-run')
  }

  if (plan.gitChecks === false) {
    publishArgs.push('--no-git-checks')
  }

  return publishArgs
}

const run = (args = process.argv.slice(2)) => {
  const plan = createPublishPlan(args)

  if (!plan.skipBuild) {
    runPnpmCommand(['--filter', plan.target.packageName, 'build'])
  }

  runPnpmCommand(createPublishArgs(plan), {
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

export { createPublishArgs, createPublishPlan, run }
