import type {
  DocsHomeConfig as ThemeDocsHomeConfig,
  DocsThemeLocalizedText,
  DocsSlotsConfig as ThemeDocsSlotsConfig,
} from '../theme/types'
import type { ComponentMap } from '@blackwork/machine'
import type { SocialLinkIconType } from 'blackwork'

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

export interface DocsThemeNavItemConfig {
  href: string
  label?: DocsSidebarLabel
}

export type DocsThemeNavConfig = DocsThemeNavItemConfig[] | false

export interface DocsContentSectionConfig {
  layout?: DocsSectionLayout
  sidebar?: DocsSidebarMode
  label?: DocsSidebarLabel
}

export interface DocsContentConfig {
  root?: string
  defaultLocale?: string
  enableDefaultLocaleRedirect?: boolean
  locales?: Record<string, DocsLocaleDefinition>
  sections?: Record<string, DocsContentSectionConfig>
}

export type DocsThemeLocalizedLabel = DocsThemeLocalizedText

export interface DocsThemeLabelsConfig {
  changeLanguage?: DocsThemeLocalizedLabel
  documentationPages?: DocsThemeLocalizedLabel
  documentPager?: DocsThemeLocalizedLabel
  next?: DocsThemeLocalizedLabel
  openSectionNavigation?: DocsThemeLocalizedLabel
  openSiteNavigation?: DocsThemeLocalizedLabel
  previous?: DocsThemeLocalizedLabel
  primaryNavigation?: DocsThemeLocalizedLabel
  scrollToTop?: DocsThemeLocalizedLabel
  sections?: DocsThemeLocalizedLabel
  toggleTheme?: DocsThemeLocalizedLabel
}

export interface DocsThemeTocConfig {
  collapseLabel?: DocsThemeLocalizedLabel
  expandLabel?: DocsThemeLocalizedLabel
  openLabel?: DocsThemeLocalizedLabel
  title?: DocsThemeLocalizedLabel
}

export interface DocsThemeSocialLinkConfig {
  type: SocialLinkIconType
  link: string
  label?: DocsThemeLocalizedLabel
  ariaLabel?: DocsThemeLocalizedLabel
}

export interface DocsThemeConfig {
  [key: string]: unknown
  labels?: DocsThemeLabelsConfig
  nav?: DocsThemeNavConfig
  socialLinks?: DocsThemeSocialLinkConfig[] | false
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
  label?: DocsSidebarLabel
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
