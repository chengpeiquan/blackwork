import { compile } from '../compiler/compile'
import type { CompileOptions } from '../types'

export interface MDXContentProps extends Omit<CompileOptions, 'format'> {
  source: string
}

export const MDXContent = async ({ source, ...options }: MDXContentProps) => {
  const result = await compile(source, {
    ...options,
    format: 'mdx',
  })

  return result.jsxElement
}
