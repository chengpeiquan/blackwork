import {
  createDocMetadata,
  type DocsMetadata,
} from '../metadata/create-doc-metadata'
import {
  resolveDocsRoute,
  type DocsRouteParams,
} from '../routing/resolve-docs-route'
import { createNextDocsContext } from './context'
import type { DocsConfig, NormalizedDocsConfig } from '../config/types'

export interface GenerateMetadataOptions {
  config?: DocsConfig | NormalizedDocsConfig
  params?: DocsRouteParams | Promise<DocsRouteParams>
  rootDir?: string
}

export const generateMetadata = async ({
  config,
  params,
  rootDir,
}: GenerateMetadataOptions = {}): Promise<
  DocsMetadata | Record<string, never>
> => {
  const { normalizedConfig, source } = await createNextDocsContext({
    config,
    rootDir,
  })
  const resolution = resolveDocsRoute({
    source,
    params: await params,
  })

  if (resolution.kind === 'notFound') {
    return {}
  }

  const pathname =
    resolution.kind === 'redirect'
      ? (source.getLegacyAliasHref(
          resolution.locale,
          resolution.slugSegments,
        ) ?? resolution.entry.href)
      : resolution.entry.href

  return createDocMetadata({
    config: normalizedConfig,
    entry: resolution.entry,
    pathname,
    source,
  })
}
