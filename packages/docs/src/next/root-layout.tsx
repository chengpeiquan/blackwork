import { ThemeProvider, type ThemeProviderConfig } from 'blackwork'
import { ThemeScript } from 'blackwork/rsc'
import { defineConfig } from '../config/define-config'
import { DocsScrollReset } from '../theme/components/docs-scroll-reset'
import { DocsDocumentLangSync } from './document-lang-sync'
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

const createDocumentLangScript = (config: NormalizedDocsConfig) => {
  const fallback = resolveDocumentLang({ config, pathname: '/' })
  const locales = Object.entries(config.content.locales ?? {}).reduce<
    Record<string, string>
  >((result, [locale, definition]) => {
    const lang = definition.lang || definition.code || locale
    result[locale] = lang
    result[definition.code] = lang
    return result
  }, {})
  const payload = JSON.stringify({ fallback, locales }).replaceAll(
    '<',
    '\\u003c',
  )

  return `(()=>{const value=${payload};const locale=location.pathname.split('/').filter(Boolean)[0];document.documentElement.lang=value.locales[locale]||value.fallback})()`
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
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: createDocumentLangScript(normalizedConfig),
          }}
        />
        <ThemeScript {...themeConfig} />
      </head>
      <body className="flex min-h-screen w-screen flex-col">
        <ThemeProvider {...themeConfig}>
          <DocsDocumentLangSync content={normalizedConfig.content} />
          <DocsScrollReset />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
