import { afterEach, expect, test, vi } from 'vitest'

afterEach(() => {
  vi.doUnmock('../src/next/metadata.ts')
  vi.doUnmock('../src/next/page.tsx')
  vi.resetModules()
  vi.restoreAllMocks()
})

test('root barrel keeps the Next page surface lazy until wrapper calls need it', async () => {
  const events: string[] = []
  const DocsPage = vi.fn<(options: { rootDir: string }) => Promise<string>>(
    async () => 'page-result',
  )
  const generateStaticParams = vi.fn<
    (options: { rootDir: string }) => Promise<Array<{ slug: string[] }>>
  >(async () => [{ slug: ['guide'] }])
  const generateMetadata = vi.fn<
    (options: { rootDir: string }) => Promise<{ title: string }>
  >(async () => ({ title: 'Docs metadata' }))

  vi.doMock('../src/next/page.tsx', () => {
    events.push('page-loaded')

    return {
      DocsPage,
      dynamicParams: false,
      generateStaticParams,
    }
  })

  vi.doMock('../src/next/metadata.ts', () => {
    events.push('metadata-loaded')

    return {
      generateMetadata,
    }
  })

  const docs = await import('../src/index.ts')

  expect(docs.dynamicParams).toBe(false)
  expect(typeof docs.DocsRootLayout).toBe('function')
  expect(events).toEqual([])

  await expect(
    docs.generateStaticParams({
      rootDir: '/tmp/blackwork-docs',
    }),
  ).resolves.toEqual([{ slug: ['guide'] }])
  expect(events).toEqual(['page-loaded'])

  await expect(
    docs.DocsPage({
      rootDir: '/tmp/blackwork-docs',
    }),
  ).resolves.toBe('page-result')
  expect(DocsPage).toHaveBeenCalledWith({
    rootDir: '/tmp/blackwork-docs',
  })

  await expect(
    docs.generateMetadata({
      rootDir: '/tmp/blackwork-docs',
    }),
  ).resolves.toEqual({
    title: 'Docs metadata',
  })
  expect(events).toEqual(['page-loaded', 'metadata-loaded'])
})
