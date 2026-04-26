import { ThemeProvider, ThemeScript, type ThemeProviderConfig } from 'blackwork'
import { defineConfig } from '../config/define-config'
import { DocsScrollReset } from '../theme/components/docs-scroll-reset'
import { resolveDocumentLang } from './resolve-document-lang'
import type { DocsConfig, NormalizedDocsConfig } from '../config/types'
import type { DocsRouteParams } from '../routing/resolve-docs-route'
import type { ReactNode } from 'react'

export interface DocsRootLayoutProps {
  children: ReactNode
  config?: DocsConfig | NormalizedDocsConfig
  params?: DocsRouteParams | Promise<DocsRouteParams>
}

const toPathname = async (
  params?: DocsRouteParams | Promise<DocsRouteParams>,
) => {
  const resolvedParams = params ? await params : undefined
  const slug =
    resolvedParams?.slug?.filter((segment) => segment.length > 0) ?? []

  return slug.length > 0 ? `/${slug.join('/')}` : '/'
}

const isTheme = (
  value: unknown,
): value is ThemeProviderConfig['defaultTheme'] =>
  value === 'light' || value === 'dark'

const resolveThemeConfig = (
  value: NormalizedDocsConfig['theme'],
): ThemeProviderConfig => {
  const storageKey =
    typeof value.storageKey === 'string' ? value.storageKey : undefined
  const defaultTheme = isTheme(value.defaultTheme)
    ? value.defaultTheme
    : undefined

  return {
    ...(storageKey ? { storageKey } : {}),
    ...(defaultTheme ? { defaultTheme } : {}),
  }
}

export const DocsRootLayout = async ({
  children,
  config,
  params,
}: DocsRootLayoutProps) => {
  const normalizedConfig = defineConfig(config)
  const pathname = await toPathname(params)
  const documentLang = resolveDocumentLang({
    config: normalizedConfig,
    pathname,
  })
  const themeConfig = resolveThemeConfig(normalizedConfig.theme)

  return (
    <html lang={documentLang} suppressHydrationWarning>
      <head>
        <ThemeScript {...themeConfig} />
      </head>
      <body className="flex min-h-screen w-screen flex-col">
        <ThemeProvider {...themeConfig}>
          <DocsScrollReset />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
