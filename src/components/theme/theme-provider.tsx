import React from 'react'
import { isBrowser, isUndefined, noop } from '@bassist/utils'
import {
  type Theme,
  type ThemeProviderProps,
  defaultStorageKey,
  defaultThemeValue,
} from './types'

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'dark',
  setTheme: noop,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

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
  const [theme, setTheme] = useState<Theme>(
    getLocalThemeValue(storageKey, defaultTheme),
  )

  useEffect(() => {
    const root = window.document.documentElement
    if (!root.classList.contains(theme)) {
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
    }
  }, [theme])

  const setThemeAndStorage = useCallback(
    (theme: Theme) => {
      setTheme(theme)
      setLocalThemeValue(storageKey, theme)
    },
    [storageKey],
  )

  const value = useMemo(() => {
    return { theme, setTheme: setThemeAndStorage }
  }, [setThemeAndStorage, theme])

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (isUndefined(context)) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
