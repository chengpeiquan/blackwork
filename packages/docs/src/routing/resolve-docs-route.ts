import type { DocEntry, DocsSource } from '../source/types'

export interface DocsRouteParams {
  slug?: string[]
}

export interface ResolveDocsRouteOptions {
  source: DocsSource
  params?: DocsRouteParams
}

export interface ResolvedDocsPageRoute {
  kind: 'page'
  locale: string
  slugSegments: string[]
  href: string
  entry: DocEntry
}

export interface ResolvedDocsRedirectRoute {
  kind: 'redirect'
  locale: string
  slugSegments: string[]
  href: string
  entry: DocEntry
}

export interface ResolvedDocsNotFoundRoute {
  kind: 'notFound'
}

export type DocsRouteResolution =
  | ResolvedDocsPageRoute
  | ResolvedDocsRedirectRoute
  | ResolvedDocsNotFoundRoute

const NOT_FOUND: ResolvedDocsNotFoundRoute = {
  kind: 'notFound',
}

const normalizeSlugSegments = (slug: string[] | undefined) =>
  slug?.filter((segment) => segment.length > 0) ?? []

const toPageRoute = (
  locale: string | undefined,
  slugSegments: string[],
  source: DocsSource,
): DocsRouteResolution => {
  if (!locale) {
    return NOT_FOUND
  }

  const entry = source.getEntry(locale, slugSegments)

  if (!entry) {
    return NOT_FOUND
  }

  return {
    kind: 'page',
    locale,
    slugSegments,
    href: entry.href,
    entry,
  }
}

export function resolveDocsRoute({
  source,
  params = {},
}: ResolveDocsRouteOptions): DocsRouteResolution {
  const defaultLocale = source.getDefaultLocale()
  const localeCodes = new Set(source.getLocaleCodes())
  const slugSegments = normalizeSlugSegments(params.slug)
  const [maybeLocale, ...nestedSlugSegments] = slugSegments

  if (maybeLocale && localeCodes.has(maybeLocale)) {
    if (maybeLocale === defaultLocale) {
      if (!source.isDefaultLocaleRedirectEnabled()) {
        return NOT_FOUND
      }

      const entry = source.getEntry(maybeLocale, nestedSlugSegments)

      if (!entry) {
        return NOT_FOUND
      }

      return {
        kind: 'redirect',
        locale: maybeLocale,
        slugSegments: nestedSlugSegments,
        href: entry.href,
        entry,
      }
    }

    return toPageRoute(maybeLocale, nestedSlugSegments, source)
  }

  return toPageRoute(defaultLocale, slugSegments, source)
}
