import type {
  DocsLocaleDefinition,
  NormalizedDocsConfig,
  NormalizedDocsContentConfig,
} from '../config/types'

export interface ResolveDocumentLangOptions {
  config: Pick<NormalizedDocsConfig, 'content'>
  pathname?: string | null
}

const getLocaleDefinitions = (
  content: Pick<NormalizedDocsContentConfig, 'defaultLocale' | 'locales'>,
) => Object.values(content.locales ?? {})

const findLocaleDefinition = (
  content: Pick<NormalizedDocsContentConfig, 'defaultLocale' | 'locales'>,
  locale: string | undefined,
): DocsLocaleDefinition | undefined => {
  if (!locale) {
    return undefined
  }

  return (
    content.locales?.[locale] ??
    getLocaleDefinitions(content).find((item) => item.code === locale)
  )
}

const getPathLocale = (
  content: Pick<NormalizedDocsContentConfig, 'defaultLocale' | 'locales'>,
  pathname?: string | null,
) => {
  const normalizedPathname = pathname?.split('?')[0]?.split('#')[0] ?? ''
  const [firstSegment] = normalizedPathname.split('/').filter(Boolean)

  return firstSegment ? findLocaleDefinition(content, firstSegment) : undefined
}

const getFallbackLocale = (
  content: Pick<NormalizedDocsContentConfig, 'defaultLocale' | 'locales'>,
) =>
  findLocaleDefinition(content, content.defaultLocale) ??
  getLocaleDefinitions(content)[0]

export const resolveDocumentLang = ({
  config,
  pathname,
}: ResolveDocumentLangOptions) => {
  const { content } = config
  const locale = getPathLocale(content, pathname) ?? getFallbackLocale(content)

  return locale?.lang || locale?.code || content.defaultLocale || 'en'
}
