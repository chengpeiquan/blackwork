import matter from 'gray-matter'
import type { FrontmatterParseResult } from './types'

export const parseFrontmatter = (source: string): FrontmatterParseResult => {
  const { content, data } = matter(source)

  return {
    frontmatter: data,
    body: content,
  }
}
