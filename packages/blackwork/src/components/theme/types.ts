import { type PrefersColorScheme } from '@bassist/utils'

export type Theme = PrefersColorScheme

export interface ThemeProviderConfig {
  storageKey?: string
  defaultTheme?: Theme
}

export interface ThemeProviderProps extends ThemeProviderConfig {
  children: React.ReactNode
}

export const defaultThemeValue: Theme = 'dark'

export const defaultStorageKey = 'blackwork-theme'
