import React from 'react'
import { ThemeProvider, ThemeScript } from '@/components/theme'
import { cn } from '@/utils'

export interface RootLayoutProps {
  /**
   * HTML Language Code
   *
   * @see https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
   */
  lang?: string

  /**
   * Class Name for `<body />`
   */
  className?: string

  /**
   * Rendering to `<head />`
   */
  metadata?: React.ReactNode

  /**
   * Rendering to `<body />`
   */
  children: React.ReactNode
}

/**
 * Base HTML layout component with dark theme support
 */
export const RootLayout = memo(
  ({ lang = 'en', className, metadata, children }: RootLayoutProps) => {
    const cls = cn('flex flex-col w-screen min-h-screen', className)

    return (
      <html lang={lang} suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" />
          <ThemeScript />
          {metadata}
        </head>

        <body className={cls}>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    )
  },
)
