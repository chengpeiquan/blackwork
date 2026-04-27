const packageRegistry = {
  ui: {
    alias: 'ui',
    dir: 'blackwork',
    packageName: 'blackwork',
  },
  machine: {
    alias: 'machine',
    dir: 'machine',
    packageName: '@blackwork/machine',
  },
  docs: {
    alias: 'docs',
    dir: 'docs',
    packageName: '@blackwork/docs',
  },
  search: {
    alias: 'search',
    dir: 'search',
    packageName: '@blackwork/search',
  },
}

const registryEntries = Object.values(packageRegistry).map((target) => ({
  ...target,
  packageDir: `packages/${target.dir}`,
}))

const packageLookup = registryEntries.reduce((map, target) => {
  map.set(target.alias, target)
  map.set(target.dir, target)
  map.set(target.packageName, target)
  return map
}, new Map())

const getKnownTargets = () => {
  return registryEntries
    .map(
      (target) =>
        `${target.alias} -> ${target.packageName} (${target.packageDir})`,
    )
    .join('\n')
}

const resolvePackageTarget = (input) => {
  const normalized = input?.trim()
  const target = normalized ? packageLookup.get(normalized) : undefined

  if (!target) {
    throw new Error(
      `Unknown package target: ${input || '<empty>'}\nAvailable targets:\n${getKnownTargets()}`,
    )
  }

  return target
}

export {
  getKnownTargets,
  packageRegistry,
  registryEntries,
  resolvePackageTarget,
}
