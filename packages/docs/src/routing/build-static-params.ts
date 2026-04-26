import type { DocsRouteParams } from './resolve-docs-route'
import type { DocsSource } from '../source/types'

export interface BuildDocsStaticParamsOptions {
  source: DocsSource
}

const toRouteParams = (href: string): DocsRouteParams => {
  const slug = href.split('/').filter(Boolean)

  if (slug.length === 0) {
    return {}
  }

  return { slug }
}

const getRouteParamKey = ({ slug }: DocsRouteParams) => slug?.join('/') ?? ''

export function buildDocsStaticParams({
  source,
}: BuildDocsStaticParamsOptions): DocsRouteParams[] {
  const canonicalParams = source
    .getLocaleCodes()
    .flatMap((locale) => source.getEntries(locale))
    .map((entry) => toRouteParams(entry.href))
  const aliasParams = source.isDefaultLocaleRedirectEnabled()
    ? source.getAliasEntries().map((entry) => toRouteParams(entry.legacyHref))
    : []
  const dedupedParams = new Map<string, DocsRouteParams>()

  for (const params of [...canonicalParams, ...aliasParams]) {
    dedupedParams.set(getRouteParamKey(params), params)
  }

  return [...dedupedParams.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, params]) => params)
}
