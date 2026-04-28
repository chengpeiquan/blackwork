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

export interface DocsThemeHomeData {
  badge?: string
  description: string
  eyebrow?: string
  highlights: DocsThemeHomeHighlight[]
  homeHref: string
  mode: 'auto' | 'configured'
  primaryAction: DocsThemeHomeAction
  secondaryAction?: DocsThemeHomeAction
  title: string
}

export interface DocsHomeConfig {
  badge?: string | false
  eyebrow?: string | false
  title?: string
  description?: string
  primaryAction?: DocsThemeHomeAction
  secondaryAction?: DocsThemeHomeAction
  highlights?: DocsThemeHomeHighlight[] | false
}

export type DocsSlotsConfig = DocsThemeSlots
