import { compile } from '../compiler/compile'
import type { CompileOptions } from '../types'

export interface MarkdownProps extends CompileOptions {
  source: string
}

export const Markdown = async ({ source, ...options }: MarkdownProps) => {
  const result = await compile(source, options)
  return result.jsxElement
}
