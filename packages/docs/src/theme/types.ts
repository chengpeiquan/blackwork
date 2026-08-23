import type { DocEntry } from '../source/types'
import type { AnchorHTMLAttributes, ComponentType, ReactNode } from 'react'

export interface DocsThemeNavItem {
  href: string
  label: string
  current: boolean
}

export interface DocsThemeLocaleLink {
  locale: string
  href: string
  label?: string
  lang?: string
  current: boolean
}

export interface DocsThemeLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children?: ReactNode
}

export type DocsThemeLinkComponent = ComponentType<DocsThemeLinkProps>

export interface DocsThemeFooterSlotProps {
  description: string
  homeHref: string
  navigation: DocsThemeNavItem[]
  siteTitle: string
  LinkComponent?: DocsThemeLinkComponent
}

export interface DocsThemeHeaderActionsProps {
  homeHref: string
  localeLinks?: DocsThemeLocaleLink[]
  navigation: DocsThemeNavItem[]
  siteDescription?: string
  siteTitle: string
}

export interface DocsThemeContentHeaderMetaProps {
  entry: DocEntry
}

export interface DocsThemeSlots {
  contentHeaderMeta?: ComponentType<DocsThemeContentHeaderMetaProps>
  footer?: ComponentType<DocsThemeFooterSlotProps>
  headerActions?: ComponentType<DocsThemeHeaderActionsProps>
  link?: DocsThemeLinkComponent
}

export interface DocsThemeHomeAction {
  href: string
  label: string
}

export interface DocsThemeHomeHighlight {
  href: string
  title: string
  description: string
}

export interface DocsThemeHomeBadgeImage {
  alt: string
  href?: string
  src: string
}

export interface DocsThemeHomeData {
  badge?: string | DocsThemeHomeBadgeImage
  description: string
  eyebrow?: string
  highlights: DocsThemeHomeHighlight[]
  homeHref: string
  mode: 'auto' | 'configured'
  primaryAction: DocsThemeHomeAction
  secondaryAction?: DocsThemeHomeAction
  title: string
}

export type DocsThemeLocalizedText = string | Record<string, string>

export interface DocsHomeBadgeImageConfig {
  alt: DocsThemeLocalizedText
  href?: string
  src: string
}

export interface DocsHomeActionConfig {
  href: string
  label: DocsThemeLocalizedText
}

export interface DocsHomeHighlightConfig {
  href: string
  title: DocsThemeLocalizedText
  description: DocsThemeLocalizedText
}

export interface DocsHomeConfig {
  badge?: DocsHomeBadgeImageConfig | DocsThemeLocalizedText | false
  eyebrow?: DocsThemeLocalizedText | false
  title?: DocsThemeLocalizedText
  description?: DocsThemeLocalizedText
  primaryAction?: DocsHomeActionConfig
  secondaryAction?: DocsHomeActionConfig
  highlights?: DocsHomeHighlightConfig[] | false
}

export type DocsSlotsConfig = DocsThemeSlots
