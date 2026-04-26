import { buildDocsStaticParams } from '../routing/build-static-params'
import {
  resolveDocsRoute,
  type DocsRouteParams,
} from '../routing/resolve-docs-route'
import { createNextDocsContext } from './context'
import {
  renderResolvedDocsRoute,
  type DocsPageAdapterHooks,
} from './render-route'
import type { DocsConfig, NormalizedDocsConfig } from '../config/types'
import type { ReactNode } from 'react'

export const dynamicParams = false

export interface GenerateStaticParamsOptions {
  config?: DocsConfig | NormalizedDocsConfig
  rootDir?: string
}

export interface DocsPageProps
  extends DocsPageAdapterHooks, GenerateStaticParamsOptions {
  params?: DocsRouteParams | Promise<DocsRouteParams>
}

export const generateStaticParams = async ({
  config,
  rootDir,
}: GenerateStaticParamsOptions = {}) => {
  const { source } = await createNextDocsContext({
    config,
    rootDir,
  })

  return buildDocsStaticParams({
    source,
  })
}

export const DocsPage = async ({
  config,
  onNotFound,
  onRedirect,
  params,
  rootDir,
}: DocsPageProps): Promise<ReactNode> => {
  const { normalizedConfig, source } = await createNextDocsContext({
    rootDir,
    config,
  })
  const resolution = resolveDocsRoute({
    source,
    params: await params,
  })

  return renderResolvedDocsRoute({
    config: normalizedConfig,
    onNotFound,
    onRedirect,
    resolution,
    source,
  })
}
