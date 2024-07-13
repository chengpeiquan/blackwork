import React from 'react'
import { isBrowser } from '@bassist/utils'
import {
  type ThemeProviderConfig,
  defaultStorageKey,
  defaultThemeValue,
} from './types'

export interface ThemeScriptProps extends ThemeProviderConfig {
  /**
   * Optional nonce passed to the injected script tag,
   * used to allow-list the next-themes script in your CSP
   */
  nonce?: string
}

// Reference: https://github.com/pacocoursey/next-themes
// @ts-ignore
export const themeScript = (storageKey, defaultTheme) => {
  const el = document.documentElement
  const systemThemes = ['light', 'dark']

  function updateDOM(theme: string) {
    el.classList.remove('light', 'dark')
    el.classList.add(theme)
    setColorScheme(theme)
  }

  function setColorScheme(theme: string) {
    if (systemThemes.includes(theme)) {
      el.style.colorScheme = theme
    }
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  try {
    const themeName = localStorage.getItem(storageKey) || defaultTheme
    const theme = themeName === 'system' ? getSystemTheme() : themeName
    updateDOM(theme)
  } catch (e) {}
}

/**
 * Prevent FOUC from appearing in the page
 *
 * @see https://en.wikipedia.org/wiki/Flash_of_unstyled_content
 *
 * @example
 *
 * ```tsx
 * // your `layout.tsx`
 *
 * import React from 'react'
 * import { type Theme, ThemeProvider, ThemeScript } from 'blackwork'
 * import 'blackwork/ui-globals.css'
 * import '@/styles/globals.css'
 *
 * const themeConfig: ThemeProviderConfig = {
 *   storageKey: 'blackwork-theme',
 *   defaultTheme: 'dark',
 * }
 *
 * export default function RootLayout({
 *   children,
 * }: Readonly<{ children: React.ReactNode }>) {
 *   return (
 *     <html lang="en" suppressHydrationWarning>
 *       <head>
 *         <ThemeScript {...themeConfig} />
 *       </head>
 *       <body className={inter.className}>
 *         <ThemeProvider {...themeConfig}>
 *           {children}
 *         </ThemeProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export const ThemeScript = memo(
  ({
    storageKey = defaultStorageKey,
    defaultTheme = defaultThemeValue,
    nonce,
  }: ThemeScriptProps) => {
    const scriptArgs = JSON.stringify([storageKey, defaultTheme]).slice(1, -1)

    return (
      <script
        suppressHydrationWarning
        nonce={!isBrowser ? nonce : ''}
        dangerouslySetInnerHTML={{
          __html: `(${themeScript.toString()})(${scriptArgs})`,
        }}
      />
    )
  },
)
