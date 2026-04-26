import { buildDocsSource } from './build-docs-source'
import type { DocsManifest, DocsSource } from './types'

export const createDocsSourceFromManifest = (
  manifest: DocsManifest,
): DocsSource => {
  return buildDocsSource(manifest)
}
