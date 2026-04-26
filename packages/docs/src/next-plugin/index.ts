import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from '../config/define-config'
import {
  loadDocsContentConfig,
  resolveDocsContentConfigPath,
} from '../config/load-content-config'
import { generateDocsManifestFiles } from './generate'
import type { DocsConfig, NormalizedDocsConfig } from '../config/types'
import type { NextConfig } from 'next'

const DEFAULT_CONFIG_PATH = 'docs.config.ts'
const activeWatcherKeys = new Set<string>()

export interface WithBlackworkDocsOptions {
  config?: DocsConfig | NormalizedDocsConfig
  content?: DocsConfig['content'] | NormalizedDocsConfig['content']
  rootDir?: string
  outDir?: string
  configPath?: string
}

export const withBlackworkDocs = ({
  config,
  content,
  rootDir = process.cwd(),
  outDir,
  configPath = DEFAULT_CONFIG_PATH,
}: WithBlackworkDocsOptions = {}) => {
  const resolvedRootDir = resolve(rootDir)
  const resolvedConfigPath = resolve(resolvedRootDir, configPath)
  const resolvedContentConfigPath = resolveDocsContentConfigPath({
    rootDir: resolvedRootDir,
  })
  const discoveredContent = loadDocsContentConfig({
    rootDir: resolvedRootDir,
  })
  const mergedContent =
    discoveredContent || content || config?.content
      ? {
          ...(discoveredContent ?? {}),
          ...(content ?? {}),
          ...(config?.content ?? {}),
        }
      : undefined
  const normalizedConfig = defineConfig({
    ...(config ?? {}),
    ...(mergedContent ? { content: mergedContent } : {}),
  })
  generateDocsManifestFiles({
    rootDir: resolvedRootDir,
    config: normalizedConfig,
    outDir,
  })
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '[blackwork-docs] generated manifest available at .blackwork/docs/manifest.mjs',
    )
  }

  if (process.env.NODE_ENV === 'development') {
    ensureDocsWatcher({
      config: normalizedConfig,
      configPath: resolvedConfigPath,
      contentConfigPath: resolvedContentConfigPath,
      outDir,
      rootDir: resolvedRootDir,
    })
  }

  return (nextConfig: NextConfig = {}): NextConfig => {
    const nextTurbopack = nextConfig.turbopack ?? {}

    return {
      ...nextConfig,
      turbopack: {
        ...nextTurbopack,
        resolveAlias: {
          ...nextTurbopack.resolveAlias,
          'private-blackwork-docs-root/*': './*',
        },
      },
      webpack(config, options) {
        config.resolve ||= {}
        config.resolve.alias ||= {}
        ;(config.resolve.alias as Record<string, string>)[
          'private-blackwork-docs-root'
        ] = resolvedRootDir

        return nextConfig.webpack?.(config, options) ?? config
      },
    }
  }
}

const ensureDocsWatcher = ({
  config,
  configPath,
  contentConfigPath,
  outDir,
  rootDir,
}: {
  config: NormalizedDocsConfig
  configPath: string
  contentConfigPath?: string
  outDir?: string
  rootDir: string
}) => {
  const contentRoot = resolve(rootDir, config.content.root)
  const watcherKey = `${rootDir}:${outDir ?? '.blackwork/docs'}`

  if (activeWatcherKeys.has(watcherKey)) {
    return
  }

  activeWatcherKeys.add(watcherKey)

  void import('chokidar')
    .then(({ watch }) => {
      const watchTargets = [contentRoot]

      if (existsSync(configPath)) {
        watchTargets.push(configPath)
      }

      if (contentConfigPath && existsSync(contentConfigPath)) {
        watchTargets.push(contentConfigPath)
      }

      const watcher = watch(watchTargets, {
        ignoreInitial: true,
        persistent: true,
      })

      watcher.on('all', () => {
        generateDocsManifestFiles({
          rootDir,
          config,
          outDir,
        })
      })

      watcher.on('error', () => {
        activeWatcherKeys.delete(watcherKey)
      })

      process.once('exit', () => {
        activeWatcherKeys.delete(watcherKey)
        void watcher.close()
      })
    })
    .catch(() => {
      activeWatcherKeys.delete(watcherKey)
    })
}
