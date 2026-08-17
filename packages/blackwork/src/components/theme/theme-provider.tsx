import { isBrowser, isUndefined, noop } from '@bassist/utils'
import React from 'react'
import {
  type Theme,
  type ThemeProviderProps,
  defaultStorageKey,
  defaultThemeValue,
} from './types'

type ThemeProviderState = {
  isDark: boolean
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  isDark: true,
  theme: 'dark',
  setTheme: noop,
}

const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState)

const getLocalThemeValue = (storageKey: string, defaultTheme: Theme) => {
  if (!isBrowser) return defaultTheme
  return (localStorage.getItem(storageKey) as Theme) || defaultTheme
}

const setLocalThemeValue = (storageKey: string, themeValue: Theme) => {
  if (!isBrowser) return
  localStorage.setItem(storageKey, themeValue)
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  storageKey = defaultStorageKey,
  defaultTheme = defaultThemeValue,
  ...props
}) => {
  const [theme, setTheme] = React.useState<Theme>(
    getLocalThemeValue(storageKey, defaultTheme),
  )

  const isDark = React.useMemo(() => theme === 'dark', [theme])

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    root.style.colorScheme = theme
  }, [theme])

  const setThemeAndStorage = React.useCallback(
    (theme: Theme) => {
      setTheme(theme)
      setLocalThemeValue(storageKey, theme)
    },
    [storageKey],
  )

  const value = React.useMemo(() => {
    return { isDark, theme, setTheme: setThemeAndStorage }
  }, [isDark, setThemeAndStorage, theme])

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (isUndefined(context)) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
