import { buildDocsSource } from './build-docs-source'
import { collectDocsManifest } from './collect-docs-manifest'
import type { CreateDocsSourceOptions, DocsSource } from './types'

export function createDocsSource({
  rootDir = '.',
  config,
}: CreateDocsSourceOptions = {}): DocsSource {
  return buildDocsSource(
    collectDocsManifest({
      rootDir,
      config,
    }),
  )
}
