import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

const workspaceRoot = join(process.cwd(), '..')

describe('GitHub Pages deployment', () => {
  test('deploys the static export to gh-pages with a custom domain', () => {
    const workflow = readFileSync(
      join(workspaceRoot, '.github/workflows/github-ci.yml'),
      'utf8',
    )

    expect(workflow).toContain('crazy-max/ghaction-github-pages@v2')
    expect(workflow).toContain('target_branch: gh-pages')
    expect(workflow).toContain('build_dir: docs/.next-static')
    expect(workflow).toContain('jekyll: false')
    expect(workflow).toContain('secrets.ACCESS_TOKEN')
    expect(workflow).not.toContain('NEXT_BASE_PATH')
  })

  test('publishes the custom domain and Jekyll skip marker', () => {
    expect(
      readFileSync(join(process.cwd(), 'public/CNAME'), 'utf8').trim(),
    ).toBe('ui.chengpeiquan.com')
    expect(existsSync(join(process.cwd(), 'public/.nojekyll'))).toBe(true)
  })

  test('prefixes Pagefind requests with the GitHub Pages base path', () => {
    const searchSource = readFileSync(
      join(process.cwd(), 'src/search/use-docs-search.ts'),
      'utf8',
    )

    expect(searchSource).toContain('NEXT_PUBLIC_BASE_PATH')
    expect(searchSource).toContain('createSearchClient({')
  })

  test('routes in-content docs links through next/link', () => {
    const docsConfigSource = readFileSync(
      join(process.cwd(), 'docs.config.ts'),
      'utf8',
    )
    const linkSource = readFileSync(
      join(process.cwd(), 'src/mdx/components/docs-mdx-link.tsx'),
      'utf8',
    )

    expect(docsConfigSource).toContain('a: DocsMdxLink')
    expect(docsConfigSource).toContain("url: 'https://ui.chengpeiquan.com'")
    expect(docsConfigSource).toContain('nav:')
    expect(docsConfigSource).toContain("href: '/guide/getting-started'")
    expect(docsConfigSource).toContain("href: '/components'")
    expect(linkSource).toContain("import Link from 'next/link'")
  })
})
