import { isObject, toArray } from '@bassist/utils'
import rehypeShiki from '@shikijs/rehype'
import rehypeExtractToc from '@stefanprobst/rehype-extract-toc'
import { type Element, type Root } from 'hast'
import { Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLink from 'rehype-external-links'
import rehypeReact, { type Options as RehypeReactOptions } from 'rehype-react'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { type PluggableList, unified } from 'unified'
import { visit } from 'unist-util-visit'
import remarkHeadingId from '../plugins/remark-heading-id'
import remarkVideo from '../plugins/remark-video'
import { defaultComponents } from '../runtime/default-components'
import { mergeComponents } from '../runtime/merge-components'
import type { ComponentMap, HeadingItem } from '../types'

const CODE_BLOCK_TITLE_PATTERN = /(?:^|\s)title=(?:"([^"]+)"|'([^']+)')/
const CODE_BLOCK_THEMES = {
  light: 'one-light',
  dark: 'dark-plus',
} as const

const getCodeBlockTitle = (meta?: string) => {
  if (!meta) return ''

  const match = meta.match(CODE_BLOCK_TITLE_PATTERN)
  return match?.[1] ?? match?.[2] ?? ''
}

const rehypeCodeBlockTitle = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'pre') return

      const [head] = node.children
      if (head?.type !== 'element' || head.tagName !== 'code') return

      const meta =
        head.data?.meta ??
        node.data?.meta ??
        head.properties?.metastring?.toString()
      const title = getCodeBlockTitle(meta)
      if (!title) return

      node.properties = {
        ...(node.properties ?? {}),
        'data-title': title,
      }
    })
  }
}

const isHeadingItem = (value: unknown): value is HeadingItem => {
  return isObject(value) && typeof value.id === 'string' && value.id.length > 0
}

export const createRemarkPlugins = (): PluggableList => {
  return [
    [remarkParse],
    [remarkHeadingId],
    [remarkGfm],
    [remarkDirective],
    [remarkVideo],
  ]
}

export const createRehypePlugins = ({
  includeSanitize = true,
  includeStringify = true,
}: {
  includeSanitize?: boolean
  includeStringify?: boolean
} = {}): PluggableList => {
  const plugins: PluggableList = [
    [rehypeSlug, { prefix: '' }],
    [rehypeAutolinkHeadings],
    [rehypeExtractToc],
    [rehypeExternalLink],
    [rehypeUnwrapImages],
    [rehypeCodeBlockTitle],
    [
      rehypeShiki,
      {
        addLanguageClass: true,
        parseMetaString(meta: string) {
          const title = getCodeBlockTitle(meta)
          if (!title) return {}

          return {
            'data-title': title,
          }
        },
        themes: CODE_BLOCK_THEMES,
      },
    ],
  ]

  if (includeSanitize) {
    plugins.splice(5, 0, [
      rehypeSanitize,
      {
        clobberPrefix: '',
        tagNames: [...toArray(defaultSchema.tagNames), 'video'],
        attributes: {
          ...(defaultSchema.attributes ?? {}),
          video: [
            'src',
            'poster',
            'controls',
            'preload',
            'className',
            'title',
            'style',
          ],
        },
      },
    ])
  }

  if (includeStringify) {
    plugins.push([rehypeStringify])
  }

  return plugins
}

export const createHtmlProcessor = () => {
  return unified()
    .use(createRemarkPlugins())
    .use(remarkRehype)
    .use(createRehypePlugins())
}

export const createReactProcessor = (components: ComponentMap = {}) => {
  const jsx = _jsx as RehypeReactOptions['jsx']
  const jsxs = _jsxs as RehypeReactOptions['jsxs']

  const reactOptions = {
    Fragment,
    components: mergeComponents(
      defaultComponents,
      components,
    ) as RehypeReactOptions['components'],
    ignoreInvalidStyle: true,
    jsx,
    jsxs,
    passKeys: true,
    passNode: true,
    development: false,
  } satisfies RehypeReactOptions

  return unified()
    .use(createRemarkPlugins())
    .use(remarkRehype)
    .use(createRehypePlugins())
    .use(rehypeReact, reactOptions)
}

export const extractHeadings = (value: unknown): HeadingItem[] => {
  return toArray(value).filter(isHeadingItem)
}
