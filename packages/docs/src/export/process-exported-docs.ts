import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'
import { defineDocsConfig } from '../config/define-docs-config'
import type { DocsConfig, NormalizedDocsConfig } from '../config/types'

export interface ProcessExportedDocsOptions {
  config?: DocsConfig | NormalizedDocsConfig
  outDir: string
  rootDir?: string
}

const findLocaleDefinition = (
  config: NormalizedDocsConfig,
  locale: string | undefined,
) => {
  if (!locale) {
    return undefined
  }

  return (
    config.content.locales?.[locale] ??
    Object.values(config.content.locales ?? {}).find(
      (item) => item.code === locale,
    )
  )
}

const resolveDefaultLang = (config: NormalizedDocsConfig) => {
  const defaultLocale = findLocaleDefinition(
    config,
    config.content.defaultLocale,
  )

  return (
    defaultLocale?.lang ||
    defaultLocale?.code ||
    config.content.defaultLocale ||
    'en'
  )
}

const resolveDocumentLang = (
  config: NormalizedDocsConfig,
  filePath: string,
  rootDir: string,
) => {
  const relativePath = relative(rootDir, filePath).split(sep).join('/')
  const [firstSegment] = relativePath.split('/').filter(Boolean)
  const locale = findLocaleDefinition(config, firstSegment)

  return locale?.lang || locale?.code || resolveDefaultLang(config)
}

const rewriteHtmlLang = (source: string, nextLang: string) => {
  if (/<html\b[^>]*\blang="[^"]*"/u.test(source)) {
    return source.replace(
      /<html\b([^>]*)\blang="[^"]*"/u,
      `<html$1lang="${nextLang}"`,
    )
  }

  return source.replace(/<html\b/u, `<html lang="${nextLang}"`)
}

const processDirectory = async (
  config: NormalizedDocsConfig,
  directoryPath: string,
  rootDir: string,
) => {
  const entries = await readdir(directoryPath, {
    withFileTypes: true,
  })

  for (const entry of entries) {
    const filePath = join(directoryPath, entry.name)

    if (entry.isDirectory()) {
      await processDirectory(config, filePath, rootDir)
      continue
    }

    if (!entry.isFile() || !entry.name.endsWith('.html')) {
      continue
    }

    const source = await readFile(filePath, 'utf8')
    const nextLang = resolveDocumentLang(config, filePath, rootDir)
    const rewritten = rewriteHtmlLang(source, nextLang)

    if (rewritten !== source) {
      await writeFile(filePath, rewritten)
    }
  }
}

export const processExportedDocs = async ({
  config = {},
  outDir,
  rootDir = '.',
}: ProcessExportedDocsOptions) => {
  const resolvedRootDir = resolve(rootDir)
  const resolvedOutDir = resolve(resolvedRootDir, outDir)
  const normalizedConfig = defineDocsConfig(config, {
    rootDir: resolvedRootDir,
  })

  await processDirectory(normalizedConfig, resolvedOutDir, resolvedOutDir)
}
