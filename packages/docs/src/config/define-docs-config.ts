import { defineConfig } from './define-config'
import { loadDocsContentConfig } from './load-content-config'
import type { LoadDocsContentConfigOptions } from './load-content-config'
import type {
  DocsConfig,
  DocsContentSectionConfig,
  NormalizedDocsConfig,
} from './types'

export interface DefineDocsConfigOptions extends LoadDocsContentConfigOptions {}

const mergeSections = (
  discoveredSections?: Record<string, DocsContentSectionConfig>,
  inlineSections?: Record<string, DocsContentSectionConfig>,
) => {
  if (!discoveredSections && !inlineSections) {
    return undefined
  }

  const sectionKeys = new Set([
    ...Object.keys(discoveredSections ?? {}),
    ...Object.keys(inlineSections ?? {}),
  ])

  return Object.fromEntries(
    [...sectionKeys].map((sectionKey) => [
      sectionKey,
      {
        ...(discoveredSections?.[sectionKey] ?? {}),
        ...(inlineSections?.[sectionKey] ?? {}),
      },
    ]),
  ) as Record<string, DocsContentSectionConfig>
}

export function defineDocsConfig(
  config: DocsConfig | NormalizedDocsConfig = {},
  options: DefineDocsConfigOptions = {},
): NormalizedDocsConfig {
  const discoveredContent = loadDocsContentConfig(options)
  const mergedSections = mergeSections(
    discoveredContent?.sections,
    config.content?.sections,
  )
  const mergedContent =
    discoveredContent || config.content
      ? {
          ...(discoveredContent ?? {}),
          ...(config.content ?? {}),
          ...(mergedSections ? { sections: mergedSections } : {}),
        }
      : undefined

  return defineConfig({
    ...config,
    ...(mergedContent ? { content: mergedContent } : {}),
  })
}
