import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'

const Link: React.FC<React.PropsWithChildren<{ href: string }>> = ({
  children,
  href,
}) => React.createElement('a', { href, 'data-link': href }, children)

const ExternalLink: React.FC<React.PropsWithChildren<{ href: string }>> = ({
  children,
  href,
}) => React.createElement('a', { href, 'data-external-link': href }, children)

const Image: React.FC<{ src: string; alt?: string }> = ({ src, alt }) =>
  React.createElement('img', { 'data-next-image': src, alt })

const CodeBlock: React.FC<
  React.PropsWithChildren<{
    fileName?: string
    language?: string
    rawCode?: string
  }>
> = ({ children, fileName, language, rawCode }) =>
  React.createElement(
    'div',
    {
      'data-file-name': fileName,
      'data-language': language,
      'data-raw-code': rawCode,
    },
    children,
  )

const Table: React.FC<React.PropsWithChildren> = ({ children }) =>
  React.createElement('table', { 'data-table': 'custom' }, children)

const importDocs = () => import('@blackwork/docs')

const importDocsRuntime = () => import('@blackwork/docs/runtime')

const importBuiltRuntimeEsm = () =>
  import(new URL('../dist/runtime.mjs', import.meta.url).href)

const requireBuiltRuntimeCjs = () =>
  createRequire(import.meta.url)('../dist/runtime.cjs') as Record<
    string,
    unknown
  >

const getPackageJson = () => {
  const packageJsonPath = new URL('../package.json', import.meta.url)

  return JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
    exports: Record<string, Record<string, string>>
  }
}

const renderTable = (
  TableComponent: React.ElementType,
  props?: Record<string, unknown>,
) => {
  return renderToStaticMarkup(
    React.createElement(
      TableComponent,
      props,
      React.createElement(
        'tbody',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement('td', null, 'Cell'),
        ),
      ),
    ),
  )
}

test('root barrel does not export runtime mdx helpers', async () => {
  const docs = await importDocs()

  expect(docs.defineConfig).toBe((await import('../src/index.ts')).defineConfig)

  expect('defaultDocsComponents' in docs).toBe(false)
  expect('mergeDocsComponents' in docs).toBe(false)
})

test('runtime entry exports the docs mdx component helpers', async () => {
  const runtime = await importDocsRuntime()
  const pkg = getPackageJson()

  expect(runtime.mergeDocsComponents).toBe(
    (await import('../src/runtime.ts')).mergeDocsComponents,
  )
  expect(runtime.defaultDocsComponents).toBeDefined()
  expect(runtime.mergeDocsComponents).toBeTypeOf('function')
  expect(runtime.defaultDocsComponents.pre).toBeDefined()
  expect(pkg.exports['./runtime']).toEqual({
    types: './dist/runtime.d.ts',
    import: './dist/runtime.mjs',
    require: './dist/runtime.cjs',
  })
})

test('built runtime artifacts expose only the intended public exports and match source behavior', async () => {
  const sourceRuntime = await importDocsRuntime()
  const builtRuntimeEsm = await importBuiltRuntimeEsm()
  const builtRuntimeCjs = requireBuiltRuntimeCjs()
  const expectedKeys = ['defaultDocsComponents', 'mergeDocsComponents']
  const sourceTableHtml = renderTable(
    sourceRuntime.defaultDocsComponents.table as React.ElementType,
    {
      node: { type: 'element', tagName: 'table' },
      'data-table-id': 'demo',
    },
  )
  const expectedOverrideHtml = renderTable(Table)

  expect(Object.keys(builtRuntimeEsm).sort()).toEqual(expectedKeys)
  expect(Object.keys(builtRuntimeCjs).sort()).toEqual(expectedKeys)
  expect(
    renderTable(
      builtRuntimeEsm.defaultDocsComponents.table as React.ElementType,
      {
        node: { type: 'element', tagName: 'table' },
        'data-table-id': 'demo',
      },
    ),
  ).toBe(sourceTableHtml)
  expect(
    renderTable(
      builtRuntimeCjs.defaultDocsComponents.table as React.ElementType,
      {
        node: { type: 'element', tagName: 'table' },
        'data-table-id': 'demo',
      },
    ),
  ).toBe(sourceTableHtml)
  expect(
    renderTable(
      builtRuntimeEsm.mergeDocsComponents({ table: Table })
        .table as React.ElementType,
    ),
  ).toBe(expectedOverrideHtml)
  expect(
    renderTable(
      builtRuntimeCjs.mergeDocsComponents({ table: Table })
        .table as React.ElementType,
    ),
  ).toBe(expectedOverrideHtml)
})

test('defaultDocsComponents.table strips the mdx node prop before rendering the table', async () => {
  const runtime = await importDocsRuntime()
  const html = renderTable(
    runtime.defaultDocsComponents.table as React.ElementType,
    {
      node: { type: 'element', tagName: 'table' },
      'data-table-id': 'demo',
    },
  )

  expect(html).toContain('data-table-id="demo"')
  expect(html).not.toContain('node=')
})

test('mergeDocsComponents lets a user table override win over the default docs table', async () => {
  const runtime = await importDocsRuntime()
  const components = runtime.mergeDocsComponents({
    table: Table,
  })
  const html = renderTable(components.table as React.ElementType)

  expect(html).toContain('data-table="custom"')
  expect(html).not.toContain('overflow-x-auto')
})

test('mergeDocsComponents composes with next-adapter overrides', async () => {
  const runtime = await importDocsRuntime()
  const { createNextComponentOverrides } =
    await import('@blackwork/machine/next-adapter')
  const nextComponents = createNextComponentOverrides({
    Link,
    ExternalLink,
    Image,
    CodeBlock,
  })
  const components = runtime.mergeDocsComponents(nextComponents, {
    table: Table,
  })
  const html = renderTable(components.table as React.ElementType)

  expect(components).toEqual(
    expect.objectContaining({
      a: expect.any(Function),
      img: expect.any(Function),
      pre: expect.any(Function),
      video: expect.any(Function),
      table: expect.any(Function),
    }),
  )
  expect(html).toContain('data-table="custom"')
  expect(html).not.toContain('overflow-x-auto')
})
