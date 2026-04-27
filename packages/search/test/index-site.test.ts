import { relative, sep, resolve } from 'node:path'

import { beforeEach, describe, expect, test, vi } from 'vitest'

const { addDirectory, close, createIndex, loadPagefind, writeFiles } =
  vi.hoisted(() => {
    const addDirectory = vi.fn(async () => ({
      errors: ['warn: duplicate route'],
      page_count: 3,
    }))
    const writeFiles = vi.fn(async () => ({
      errors: ['warn: existing bundle replaced'],
      outputPath: './fixtures/pagefind',
    }))
    const createIndex = vi.fn<
      () => Promise<{
        errors: string[]
        index?: {
          addDirectory: typeof addDirectory
          writeFiles: typeof writeFiles
        }
      }>
    >(async () => ({
      errors: [] as string[],
      index: {
        addDirectory,
        writeFiles,
      },
    }))
    const close = vi.fn(async () => undefined)
    const loadPagefind = vi.fn(async () => ({
      close,
      createIndex,
    }))

    return {
      addDirectory,
      close,
      createIndex,
      loadPagefind,
      writeFiles,
    }
  })

vi.mock('../src/pagefind-loader', () => ({
  loadPagefind,
}))

import { indexSite } from '../src/index'

describe('indexSite', () => {
  beforeEach(() => {
    addDirectory.mockClear()
    close.mockClear()
    createIndex.mockClear()
    loadPagefind.mockClear()
    writeFiles.mockClear()

    createIndex.mockResolvedValue({
      errors: [],
      index: {
        addDirectory,
        writeFiles,
      },
    })
  })

  test('requires a non-empty site directory', async () => {
    await expect(indexSite({ site: '' })).rejects.toThrow(
      '[blackwork-search] "site" must be a non-empty string.',
    )

    expect(loadPagefind).not.toHaveBeenCalled()
  })

  test('normalizes site and output paths before invoking Pagefind', async () => {
    const sitePath = resolve(process.cwd(), 'fixtures/site')
    const outputPath = resolve(process.cwd(), 'fixtures/pagefind')
    const siteRelativeOutputPath = relative(sitePath, outputPath)
      .split(sep)
      .join('/')
    const writeOutputPath = resolve(process.cwd(), 'fixtures/pagefind')

    const result = await indexSite({
      glob: '**/*.html',
      output: {
        path: './fixtures/pagefind',
      },
      site: './fixtures/site',
    })

    expect(loadPagefind).toHaveBeenCalledTimes(1)
    expect(createIndex).toHaveBeenCalledTimes(1)
    expect(addDirectory).toHaveBeenCalledWith({
      glob: '**/*.html',
      path: sitePath,
    })
    expect(writeFiles).toHaveBeenCalledWith({
      outputPath,
    })
    expect(close).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      glob: '**/*.html',
      indexingErrors: ['warn: duplicate route'],
      outputPath,
      pageCount: 3,
      sitePath,
      siteRelativeOutputPath,
      writeErrors: ['warn: existing bundle replaced'],
      writeOutputPath,
    })
  })

  test('fails with Pagefind errors when createIndex returns no index', async () => {
    createIndex.mockResolvedValueOnce({
      errors: ['binary unavailable'],
    })

    await expect(indexSite({ site: './fixtures/site' })).rejects.toThrow(
      '[blackwork-search] Pagefind did not return an index: binary unavailable',
    )

    expect(addDirectory).not.toHaveBeenCalled()
    expect(writeFiles).not.toHaveBeenCalled()
    expect(close).toHaveBeenCalledTimes(1)
  })

  test('uses a pagefind directory inside the site by default', async () => {
    const sitePath = resolve(process.cwd(), 'fixtures/site')
    const outputPath = resolve(sitePath, 'pagefind')

    const result = await indexSite({
      site: './fixtures/site',
    })

    expect(writeFiles).toHaveBeenCalledWith({
      outputPath,
    })
    expect(result.outputPath).toBe(outputPath)
    expect(result.siteRelativeOutputPath).toBe('pagefind')
  })
})
