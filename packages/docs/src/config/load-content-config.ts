import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import jiti from 'jiti'
import type { DocsContentConfig } from './types'

export interface LoadDocsContentConfigOptions {
  rootDir?: string
  contentConfigPath?: string
}

export const DEFAULT_CONTENT_CONFIG_PATH = 'content.config.ts'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const resolveDocsContentConfigPath = ({
  rootDir = process.cwd(),
  contentConfigPath = DEFAULT_CONTENT_CONFIG_PATH,
}: LoadDocsContentConfigOptions = {}) => {
  const resolvedPath = resolve(rootDir, contentConfigPath)

  return existsSync(resolvedPath) ? resolvedPath : undefined
}

export const loadDocsContentConfig = ({
  rootDir = process.cwd(),
  contentConfigPath = DEFAULT_CONTENT_CONFIG_PATH,
}: LoadDocsContentConfigOptions = {}): DocsContentConfig | undefined => {
  const resolvedPath = resolveDocsContentConfigPath({
    rootDir,
    contentConfigPath,
  })

  if (!resolvedPath) {
    return undefined
  }

  const moduleExports = jiti(import.meta.url)(resolvedPath) as
    | Record<string, unknown>
    | undefined
  const contentConfig =
    moduleExports?.docsContentConfig ?? moduleExports?.default

  if (!isRecord(contentConfig)) {
    throw new TypeError(
      `[blackwork-docs] ${resolvedPath} must export a docs content config object via "docsContentConfig" or default export.`,
    )
  }

  return contentConfig as DocsContentConfig
}
