import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { parseFrontmatter } from '@blackwork/machine/server'
import { defineConfig } from '../config/define-config'
import { sortDocEntries } from './build-docs-source'
import type {
  CreateDocsSourceOptions,
  DocEntry,
  DocFormat,
  DocsManifest,
} from './types'

const DOC_EXTENSIONS = ['.mdx', '.md'] as const
const FORMAT_PRIORITY: Record<DocFormat, number> = {
  md: 1,
  mdx: 2,
}
const ROOT_SLUG_KEY = '__index__'

const humanizeSegment = (value: string) =>
  value
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

const walk = (dirPath: string): string[] => {
  if (
    !statSync(/* turbopackIgnore: true */ dirPath, {
      throwIfNoEntry: false,
    })?.isDirectory()
  ) {
    return []
  }

  return readdirSync(/* turbopackIgnore: true */ dirPath).flatMap((name) => {
    const fullPath = join(/* turbopackIgnore: true */ dirPath, name)
    const stats = statSync(/* turbopackIgnore: true */ fullPath)

    if (stats.isDirectory()) {
      return walk(fullPath)
    }

    return [fullPath]
  })
}

const getDirectoryNames = (dirPath: string) => {
  if (
    !statSync(/* turbopackIgnore: true */ dirPath, {
      throwIfNoEntry: false,
    })?.isDirectory()
  ) {
    return []
  }

  return readdirSync(/* turbopackIgnore: true */ dirPath).filter((name) =>
    statSync(join(/* turbopackIgnore: true */ dirPath, name), {
      throwIfNoEntry: false,
    })?.isDirectory(),
  )
}

const getFormat = (filePath: string): DocFormat | null => {
  if (filePath.endsWith('.mdx')) return 'mdx'
  if (filePath.endsWith('.md')) return 'md'
  return null
}

const stripExtension = (filePath: string) => {
  for (const extension of DOC_EXTENSIONS) {
    if (filePath.endsWith(extension)) {
      return filePath.slice(0, -extension.length)
    }
  }

  return filePath
}

const getSlugSegments = (localeDir: string, filePath: string) => {
  const relativePath = relative(localeDir, filePath)
  const noExtensionPath = stripExtension(relativePath)
  const segments = noExtensionPath.split(/[/\\]/u).filter(Boolean)

  if (segments.at(-1) === 'index') {
    segments.pop()
  }

  return segments
}

const coerceOrder = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

const getCanonicalHref = (
  locale: string,
  slugSegments: string[],
  defaultLocale?: string,
) => {
  const suffix = slugSegments.join('/')

  if (locale === defaultLocale) {
    return suffix ? `/${suffix}` : '/'
  }

  return suffix ? `/${locale}/${suffix}` : `/${locale}`
}

const getLegacyAliasHref = ({
  defaultLocale,
  enableDefaultLocaleRedirect,
  locale,
  slugSegments,
}: {
  defaultLocale?: string
  enableDefaultLocaleRedirect: boolean
  locale: string
  slugSegments: string[]
}) => {
  if (
    locale !== defaultLocale ||
    !defaultLocale ||
    !enableDefaultLocaleRedirect
  ) {
    return null
  }

  const suffix = slugSegments.join('/')
  return suffix ? `/${locale}/${suffix}` : `/${locale}`
}

export const collectDocsManifest = ({
  rootDir = '.',
  config,
}: CreateDocsSourceOptions = {}): DocsManifest => {
  const normalizedConfig = defineConfig(config)
  const baseDir = resolve(/* turbopackIgnore: true */ rootDir)
  const contentRoot = resolve(baseDir, normalizedConfig.content.root)
  const discoveredLocaleCodes = getDirectoryNames(contentRoot)
  const localeCodes = [
    ...new Set([
      ...(normalizedConfig.content.defaultLocale
        ? [normalizedConfig.content.defaultLocale]
        : []),
      ...Object.entries(normalizedConfig.content.locales ?? {}).map(
        ([key, locale]) => locale.code || key,
      ),
      ...discoveredLocaleCodes,
    ]),
  ]
  const entries: DocEntry[] = []

  for (const locale of localeCodes) {
    const localeDir = join(contentRoot, locale)
    const dedupedEntries = new Map<string, DocEntry>()

    for (const filePath of walk(localeDir)) {
      const format = getFormat(filePath)
      if (!format) continue

      const source = readFileSync(/* turbopackIgnore: true */ filePath, 'utf8')
      const { frontmatter } = parseFrontmatter(source)
      const slugSegments = getSlugSegments(localeDir, filePath)
      const key = slugSegments.join('/') || ROOT_SLUG_KEY
      const title =
        typeof frontmatter.title === 'string' && frontmatter.title.trim()
          ? frontmatter.title
          : slugSegments.length > 0
            ? humanizeSegment(slugSegments.at(-1) ?? 'overview')
            : 'Overview'
      const description =
        typeof frontmatter.description === 'string'
          ? frontmatter.description
          : typeof frontmatter.desc === 'string'
            ? frontmatter.desc
            : ''
      const entry: DocEntry = {
        locale,
        slugSegments,
        href: getCanonicalHref(
          locale,
          slugSegments,
          normalizedConfig.content.defaultLocale,
        ),
        legacyHref: getLegacyAliasHref({
          defaultLocale: normalizedConfig.content.defaultLocale,
          enableDefaultLocaleRedirect:
            normalizedConfig.content.enableDefaultLocaleRedirect,
          locale,
          slugSegments,
        }),
        sourcePath: filePath,
        format,
        title,
        description,
        order: coerceOrder(frontmatter.order),
        frontmatter,
      }
      const current = dedupedEntries.get(key)

      if (
        !current ||
        FORMAT_PRIORITY[entry.format] > FORMAT_PRIORITY[current.format]
      ) {
        dedupedEntries.set(key, entry)
      }
    }

    entries.push(...sortDocEntries([...dedupedEntries.values()]))
  }

  return {
    defaultLocale: normalizedConfig.content.defaultLocale,
    enableDefaultLocaleRedirect:
      normalizedConfig.content.enableDefaultLocaleRedirect,
    entries,
    localeCodes,
  }
}
