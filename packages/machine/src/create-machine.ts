import { compile } from './compiler/compile'
import { parseFrontmatter } from './frontmatter'
import type { CompileOptions } from './types'

const mergeOptions = (
  defaults: CompileOptions,
  overrides: CompileOptions = {},
): CompileOptions => {
  return {
    ...defaults,
    ...overrides,
    components: {
      ...(defaults.components ?? {}),
      ...(overrides.components ?? {}),
    },
  }
}

export const createMachine = (defaults: CompileOptions = {}) => {
  return {
    parseFrontmatter,
    compile: (source: string, options: CompileOptions = {}) =>
      compile(source, mergeOptions(defaults, options)),
  }
}
