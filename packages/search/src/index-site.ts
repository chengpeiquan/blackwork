import { join, relative, resolve, sep } from 'node:path'

import { loadPagefind } from './pagefind-loader'
import type { SearchIndexSiteOptions, SearchIndexSiteResult } from './types'

const normalizeRequiredPath = (value: string, label: string): string => {
  const normalized = value.trim()

  if (!normalized) {
    throw new TypeError(
      `[blackwork-search] "${label}" must be a non-empty string.`,
    )
  }

  return resolve(normalized)
}

const normalizeOutputPath = (
  sitePath: string,
  outputPath: string | undefined,
): string => {
  if (outputPath === undefined) {
    return join(sitePath, 'pagefind')
  }

  return normalizeRequiredPath(outputPath, 'output.path')
}

const normalizeRelativePath = (fromPath: string, toPath: string): string =>
  relative(fromPath, toPath).split(sep).join('/')

const getMissingIndexError = (errors: string[]): Error => {
  const suffix = errors.length > 0 ? `: ${errors.join('; ')}` : '.'

  return new Error(
    `[blackwork-search] Pagefind did not return an index${suffix}`,
  )
}

export const indexSite = async (
  options: SearchIndexSiteOptions,
): Promise<SearchIndexSiteResult> => {
  const sitePath = normalizeRequiredPath(options.site, 'site')
  const outputPath = normalizeOutputPath(sitePath, options.output?.path)
  const pagefind = await loadPagefind()

  try {
    const { errors, index } = await pagefind.createIndex()

    if (!index) {
      throw getMissingIndexError(errors)
    }

    const indexingSummary = await index.addDirectory({
      glob: options.glob,
      path: sitePath,
    })
    const writeSummary = await index.writeFiles({
      outputPath,
    })
    const writeOutputPath = normalizeRequiredPath(
      writeSummary.outputPath,
      'write.outputPath',
    )

    return {
      glob: options.glob,
      indexingErrors: indexingSummary.errors,
      outputPath,
      pageCount: indexingSummary.page_count,
      sitePath,
      siteRelativeOutputPath: normalizeRelativePath(sitePath, outputPath),
      writeErrors: writeSummary.errors,
      writeOutputPath,
    }
  } finally {
    await pagefind.close()
  }
}
