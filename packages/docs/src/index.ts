export { defineConfig } from './config/define-config'
export { defineDocsConfig } from './config/define-docs-config'
export { processExportedDocs } from './export/process-exported-docs'
export { createDocMetadata } from './metadata/create-doc-metadata'
export { buildHeaderNavigation } from './navigation/build-header-nav'
export { buildLocaleLinks } from './navigation/build-locale-links'
export { buildPager } from './navigation/build-pager'
export { buildSidebar } from './navigation/build-sidebar'
export { DocsRootLayout } from './next/root-layout'
export { buildDocsStaticParams } from './routing/build-static-params'
export { resolveDocsRoute } from './routing/resolve-docs-route'
export { createDocsSource } from './source/create-docs-source'

import type { DocsMetadata } from './metadata/create-doc-metadata'
import type { GenerateMetadataOptions } from './next/metadata'
import type { DocsPageProps, GenerateStaticParamsOptions } from './next/page'

export type {
  CreateDocMetadataOptions,
  DocsMetadata,
  DocsMetadataAlternates,
  DocsMetadataRobots,
} from './metadata/create-doc-metadata'
export type { GenerateMetadataOptions } from './next/metadata'
export type { DocsPageProps, GenerateStaticParamsOptions } from './next/page'
export type { DocsRootLayoutProps } from './next/root-layout'
export type { BuildHeaderNavOptions } from './navigation/build-header-nav'
export type {
  BuildLocaleLinksOptions,
  DocsLocaleLink,
} from './navigation/build-locale-links'
export type {
  BuildPagerOptions,
  DocsPager,
  DocsPagerLink,
} from './navigation/build-pager'
export type {
  BuildSidebarOptions,
  DocsSidebarItem,
} from './navigation/build-sidebar'
export type { BuildDocsStaticParamsOptions } from './routing/build-static-params'
export type {
  DocsRouteParams,
  DocsRouteResolution,
  ResolveDocsRouteOptions,
  ResolvedDocsNotFoundRoute,
  ResolvedDocsPageRoute,
  ResolvedDocsRedirectRoute,
} from './routing/resolve-docs-route'
export type { DefineDocsConfigOptions } from './config/define-docs-config'
export type { ProcessExportedDocsOptions } from './export/process-exported-docs'
export type {
  DocsConfig,
  DocsContentConfig,
  DocsContentSectionConfig,
  DocsHomeConfig,
  DocsLocaleDefinition,
  DocsMdxConfig,
  DocsSectionLayout,
  DocsSectionConfig,
  DocsSidebarConfigNode,
  DocsSidebarGroupConfig,
  DocsSidebarItemConfig,
  DocsSidebarLabel,
  DocsSidebarMode,
  DocsSiteConfig,
  DocsSlotsConfig,
  DocsThemeConfig,
  DocsThemeNavConfig,
  DocsThemeNavItemConfig,
  NormalizedDocsContentConfig,
  NormalizedDocsContentSectionConfig,
  NormalizedDocsConfig,
} from './config/types'
export type {
  CreateDocsSourceOptions,
  DocEntry,
  DocFormat,
  DocsSource,
} from './source/types'

export const dynamicParams = false

export const generateMetadata = async (
  options: GenerateMetadataOptions = {},
): Promise<DocsMetadata | Record<string, never>> => {
  const module = await import('./next/metadata')
  return module.generateMetadata(options)
}

export const generateStaticParams = async (
  options: GenerateStaticParamsOptions = {},
) => {
  const module = await import('./next/page')
  return module.generateStaticParams(options)
}

export const DocsPage = async (options: DocsPageProps) => {
  const module = await import('./next/page')
  return module.DocsPage(options)
}
