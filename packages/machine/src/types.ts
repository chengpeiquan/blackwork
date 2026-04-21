import type React from 'react'

export type ComponentMap = Record<string, React.ElementType | undefined>

export interface FrontmatterParseResult {
  frontmatter: Record<string, unknown>
  body: string
}

export interface HeadingItem {
  depth?: number
  id: string
  value?: string
  children?: HeadingItem[]
}

export interface CompileOptions {
  format?: 'markdown' | 'mdx'
  includeHtml?: boolean
  components?: ComponentMap
}

export interface CompileResult extends FrontmatterParseResult {
  excerpt: string
  headings: HeadingItem[]
  html: string
  jsxElement: React.ReactElement | null
}
