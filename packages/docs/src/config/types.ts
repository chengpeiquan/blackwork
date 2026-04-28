import type {
  DocsHomeConfig as ThemeDocsHomeConfig,
  DocsSlotsConfig as ThemeDocsSlotsConfig,
} from '../theme/types'
import type { ComponentMap } from '@blackwork/machine'

export interface DocsLocaleDefinition {
  code: string
  label?: string
  lang?: string
}

export interface DocsSiteConfig {
  title?: string
  description?: string
  url?: string
}

export type DocsSectionLayout = 'docs' | 'content'

export type DocsSidebarLabel = string | Record<string, string>

export interface DocsSidebarItemConfig {
  type: 'item'
  href: string
  label?: DocsSidebarLabel
}

export interface DocsSidebarGroupConfig {
  type: 'group'
  label: DocsSidebarLabel
  items: DocsSidebarItemConfig[]
}

export type DocsSidebarConfigNode =
  | DocsSidebarGroupConfig
  | DocsSidebarItemConfig

export type DocsSidebarMode = 'auto' | false | DocsSidebarConfigNode[]

export interface DocsContentSectionConfig {
  layout?: DocsSectionLayout
  sidebar?: DocsSidebarMode
}

export interface DocsContentConfig {
  root?: string
  defaultLocale?: string
  enableDefaultLocaleRedirect?: boolean
  locales?: Record<string, DocsLocaleDefinition>
  sections?: Record<string, DocsContentSectionConfig>
}

export type DocsThemeLocalizedLabel = string | Record<string, string>

export interface DocsThemeTocConfig {
  collapseLabel?: DocsThemeLocalizedLabel
  expandLabel?: DocsThemeLocalizedLabel
  openLabel?: DocsThemeLocalizedLabel
  title?: DocsThemeLocalizedLabel
}

export interface DocsThemeConfig {
  [key: string]: unknown
  toc?: DocsThemeTocConfig
}

export type DocsSectionConfig = Record<string, unknown>

export type DocsHomeConfig = ThemeDocsHomeConfig

export interface DocsMdxConfig {
  components?: ComponentMap
}

export type DocsSlotsConfig = ThemeDocsSlotsConfig

export interface DocsConfig {
  site?: DocsSiteConfig
  content?: DocsContentConfig
  theme?: DocsThemeConfig
  docs?: DocsSectionConfig
  home?: DocsHomeConfig
  mdx?: DocsMdxConfig
  slots?: DocsSlotsConfig
}

export interface NormalizedDocsContentConfig {
  root: string
  defaultLocale?: string
  enableDefaultLocaleRedirect: boolean
  locales?: Record<string, DocsLocaleDefinition>
  sections?: Record<string, NormalizedDocsContentSectionConfig>
}

export interface NormalizedDocsContentSectionConfig {
  layout: DocsSectionLayout
  sidebar: DocsSidebarMode
}

export interface NormalizedDocsConfig {
  site: DocsSiteConfig
  content: NormalizedDocsContentConfig
  theme: DocsThemeConfig
  docs: DocsSectionConfig
  home: DocsHomeConfig
  mdx: DocsMdxConfig
  slots: DocsSlotsConfig
}
