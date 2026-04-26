import type { DocsConfig, NormalizedDocsConfig } from '../config/types'

export type DocFormat = 'md' | 'mdx'

export interface DocEntry {
  locale: string
  slugSegments: string[]
  href: string
  legacyHref: string | null
  sourcePath: string
  loadSource?: () => Promise<string>
  format: DocFormat
  title: string
  description: string
  order?: number
  frontmatter: Record<string, unknown>
}

export interface DocsManifest {
  defaultLocale?: string
  enableDefaultLocaleRedirect: boolean
  entries: DocEntry[]
  localeCodes: string[]
}

export interface CreateDocsSourceOptions {
  rootDir?: string
  config?: DocsConfig | NormalizedDocsConfig
}

export interface DocsSource {
  getAliasEntries(): Array<DocEntry & { legacyHref: string }>
  getCanonicalHref(locale: string, slugSegments?: string[]): string
  getDefaultLocale(): string | undefined
  getEntries(locale: string): DocEntry[]
  getEntry(locale: string, slugSegments?: string[]): DocEntry | null
  isDefaultLocaleRedirectEnabled(): boolean
  getLegacyAliasHref(locale: string, slugSegments?: string[]): string | null
  getLocaleCodes(): string[]
}
