import { defaultDocsConfig } from './defaults'
import type {
  DocsConfig,
  DocsContentConfig,
  DocsContentSectionConfig,
  DocsSectionLayout,
  NormalizedDocsConfig,
  NormalizedDocsContentConfig,
  NormalizedDocsContentSectionConfig,
} from './types'

const normalizeSectionConfig = (
  section: DocsContentSectionConfig = {},
): NormalizedDocsContentSectionConfig => {
  const layout: DocsSectionLayout = section.layout ?? 'docs'

  return {
    layout,
    sidebar: section.sidebar ?? (layout === 'content' ? false : 'auto'),
  }
}

const normalizeContentSections = (
  sections?: Record<string, DocsContentSectionConfig>,
) => {
  if (!sections) {
    return undefined
  }

  return Object.fromEntries(
    Object.entries(sections).map(([key, section]) => [
      key,
      normalizeSectionConfig(section),
    ]),
  ) as Record<string, NormalizedDocsContentSectionConfig>
}

function normalizeContentConfig(
  content: DocsContentConfig = {},
): NormalizedDocsContentConfig {
  return {
    root: content.root ?? defaultDocsConfig.content.root,
    enableDefaultLocaleRedirect:
      content.enableDefaultLocaleRedirect ??
      defaultDocsConfig.content.enableDefaultLocaleRedirect,
    ...(content.defaultLocale !== undefined
      ? { defaultLocale: content.defaultLocale }
      : {}),
    ...(content.locales !== undefined ? { locales: content.locales } : {}),
    ...(content.sections !== undefined
      ? { sections: normalizeContentSections(content.sections) }
      : {}),
  }
}

export function defineConfig(config: DocsConfig = {}): NormalizedDocsConfig {
  return {
    site: {
      ...defaultDocsConfig.site,
      ...config.site,
    },
    content: normalizeContentConfig(config.content),
    theme: {
      ...defaultDocsConfig.theme,
      ...config.theme,
    },
    docs: {
      ...defaultDocsConfig.docs,
      ...config.docs,
    },
    home: {
      ...defaultDocsConfig.home,
      ...config.home,
    },
    mdx: {
      ...defaultDocsConfig.mdx,
      ...config.mdx,
    },
    slots: {
      ...defaultDocsConfig.slots,
      ...config.slots,
    },
  }
}
