import { defineConfig } from '../config/define-config'
import { createDocsSource } from '../source/create-docs-source'
import { loadGeneratedDocsSource } from './load-generated-manifest'
import type { DocsConfig, NormalizedDocsConfig } from '../config/types'

export interface CreateNextDocsContextOptions {
  config?: DocsConfig | NormalizedDocsConfig
  rootDir?: string
}

export const createNextDocsContext = async ({
  config,
  rootDir,
}: CreateNextDocsContextOptions = {}) => {
  const normalizedConfig = defineConfig(config)
  const source =
    (await loadGeneratedDocsSource()) ??
    createDocsSource({
      rootDir,
      config: normalizedConfig,
    })

  return {
    normalizedConfig,
    source,
  }
}
