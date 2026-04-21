import React from 'react'
import { parseFrontmatter } from '../frontmatter'
import { compileMdxSource } from './compile-mdx'
import {
  createHtmlProcessor,
  createReactProcessor,
  extractHeadings,
} from './create-processor'
import type { CompileOptions, CompileResult } from '../types'

const createExcerpt = (body: string) => {
  const [excerpt = ''] = body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return excerpt
}

export const compile = async (
  source: string,
  options: CompileOptions = {},
): Promise<CompileResult> => {
  if (options.format === 'mdx') {
    return compileMdxSource(source, options)
  }

  const { frontmatter, body } = parseFrontmatter(source)
  const htmlFile = await createHtmlProcessor().process(body)
  const reactFile = await createReactProcessor(options.components).process(body)

  return {
    frontmatter,
    body,
    excerpt: createExcerpt(body),
    headings: extractHeadings(htmlFile.data?.toc),
    html: String(htmlFile),
    jsxElement: React.isValidElement(reactFile.result)
      ? reactFile.result
      : null,
  }
}
