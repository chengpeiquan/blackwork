import { defineConfig } from '../config/define-config'
import { buildLocaleLinks } from '../navigation/build-locale-links'
import type { DocsConfig, NormalizedDocsConfig } from '../config/types'
import type { DocEntry, DocsSource } from '../source/types'

export interface DocsMetadataAlternates {
  canonical?: string
  languages?: Record<string, string>
}

export interface DocsMetadataRobots {
  index?: boolean
  follow?: boolean
}

export interface DocsMetadata {
  title: string
  description: string
  alternates: DocsMetadataAlternates
  robots?: DocsMetadataRobots
}

export interface CreateDocMetadataOptions {
  config?: DocsConfig | NormalizedDocsConfig
  entry: DocEntry
  pathname?: string
  source: DocsSource
}

const normalizePathname = (value: string) => {
  if (value === '/') {
    return value
  }

  return value.endsWith('/') ? value.slice(0, -1) : value
}

const toAbsoluteHref = (siteUrl: string | undefined, href: string) => {
  if (!siteUrl) {
    return href
  }

  const normalizedSiteUrl = siteUrl.endsWith('/')
    ? siteUrl.slice(0, -1)
    : siteUrl

  return href === '/' ? `${normalizedSiteUrl}/` : `${normalizedSiteUrl}${href}`
}

const toMetadataTitle = (pageTitle: string, siteTitle: string | undefined) =>
  siteTitle ? `${pageTitle} | ${siteTitle}` : pageTitle

export function createDocMetadata({
  config,
  entry,
  pathname,
  source,
}: CreateDocMetadataOptions): DocsMetadata {
  const normalizedConfig = defineConfig(config)
  const localeLinks = buildLocaleLinks({
    config: normalizedConfig,
    entry,
    source,
  })
  const languages =
    localeLinks.length > 0
      ? Object.fromEntries(
          localeLinks.map((link) => [
            link.lang || link.locale,
            toAbsoluteHref(normalizedConfig.site.url, link.href),
          ]),
        )
      : undefined
  const metadata: DocsMetadata = {
    title: toMetadataTitle(entry.title, normalizedConfig.site.title),
    description: entry.description || normalizedConfig.site.description || '',
    alternates: {
      canonical: toAbsoluteHref(normalizedConfig.site.url, entry.href),
      ...(languages ? { languages } : {}),
    },
  }
  const resolvedPathname = normalizePathname(pathname ?? entry.href)
  const canonicalPathname = normalizePathname(entry.href)

  if (resolvedPathname !== canonicalPathname) {
    metadata.robots = {
      index: false,
      follow: true,
    }
  }

  return metadata
}
