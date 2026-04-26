import { createDocsSourceFromManifest } from '../source/create-docs-source-from-manifest'
import type { DocsManifest, DocsSource } from '../source/types'

const resolveManifestModule = async (): Promise<DocsManifest | null> => {
  try {
    const manifestModule = (await import(
      /* @vite-ignore */
      'private-blackwork-docs-root/.blackwork/docs/manifest.mjs'
    )) as {
      default?: DocsManifest
      docsManifest?: DocsManifest
    }

    return manifestModule.docsManifest ?? manifestModule.default ?? null
  } catch {
    return null
  }
}

export const loadGeneratedDocsSource = async (): Promise<DocsSource | null> => {
  const manifest = await resolveManifestModule()

  if (!manifest) {
    return null
  }

  return createDocsSourceFromManifest(manifest)
}
