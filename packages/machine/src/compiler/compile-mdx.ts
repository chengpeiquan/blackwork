import { compile as compileMdx, run } from '@mdx-js/mdx'
import React from 'react'
import * as runtime from 'react/jsx-runtime'
import { parseFrontmatter } from '../frontmatter'
import { defaultComponents } from '../runtime/default-components'
import { mergeComponents } from '../runtime/merge-components'
import {
  createRehypePlugins,
  createRemarkPlugins,
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

export const compileMdxSource = async (
  source: string,
  options: CompileOptions = {},
): Promise<CompileResult> => {
  const { frontmatter, body } = parseFrontmatter(source)
  const file = await compileMdx(body, {
    format: 'mdx',
    outputFormat: 'function-body',
    development: false,
    remarkPlugins: createRemarkPlugins(),
    rehypePlugins: createRehypePlugins({
      includeSanitize: false,
      includeStringify: false,
    }),
  })

  const module = await run(file, {
    ...runtime,
  })

  const Content = module.default
  const contentProps = {
    components: mergeComponents(defaultComponents, options.components),
  }
  const element = React.createElement(Content, contentProps)
  const jsxElement = React.isValidElement(element) ? element : null
  const html =
    jsxElement && options.includeHtml !== false
      ? (await import('react-dom/server')).renderToStaticMarkup(jsxElement)
      : ''

  return {
    frontmatter,
    body,
    excerpt: createExcerpt(body),
    headings: extractHeadings(file.data?.toc),
    html,
    jsxElement,
  }
}
