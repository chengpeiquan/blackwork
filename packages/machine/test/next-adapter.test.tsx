import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { createNextComponents } from '../src/next-adapter'

const Link: React.FC<React.PropsWithChildren<{ href: string }>> = ({
  children,
  href,
}) => (
  <a href={href} data-link={href}>
    {children}
  </a>
)

const ExternalLink: React.FC<React.PropsWithChildren<{ href: string }>> = ({
  children,
  href,
}) => (
  <a href={href} data-external-link={href}>
    {children}
  </a>
)

const Image: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => (
  <img data-next-image={src} alt={alt} />
)

const CodeBlock: React.FC<
  React.PropsWithChildren<{
    fileName?: string
    language?: string
    rawCode?: string
  }>
> = ({ children, fileName, language, rawCode }) => (
  <div
    data-file-name={fileName}
    data-language={language}
    data-raw-code={rawCode}
  >
    {children}
  </div>
)

test('createNextComponents uses injected Next-style components and preserves pre extraction', async () => {
  const components = createNextComponents({
    Link,
    ExternalLink,
    Image,
    CodeBlock,
  })

  const internalLink = await components.a?.({
    href: '/docs',
    children: 'Docs',
  })
  const externalLink = await components.a?.({
    href: 'https://example.com',
    children: 'External',
  })
  const image = await components.img?.({
    src: '/cover.png',
    alt: 'Cover',
  })
  const pre = await components.pre?.({
    node: {
      type: 'element',
      tagName: 'pre',
      properties: { 'data-title': 'src/demo.ts' },
      children: [
        {
          type: 'element',
          tagName: 'code',
          properties: { class: ['language-ts'] },
          children: [{ type: 'text', value: 'const foo = 1' }],
        },
      ],
    } as any,
    children: React.createElement('code', null, 'const foo = 1'),
  })

  expect(renderToStaticMarkup(internalLink as React.ReactElement)).toContain(
    'data-link="/docs"',
  )
  expect(renderToStaticMarkup(externalLink as React.ReactElement)).toContain(
    'data-external-link="https://example.com"',
  )
  expect(renderToStaticMarkup(image as React.ReactElement)).toContain(
    'data-next-image="/cover.png"',
  )
  expect(renderToStaticMarkup(pre as React.ReactElement)).toContain(
    'data-file-name="src/demo.ts"',
  )
  expect(renderToStaticMarkup(pre as React.ReactElement)).toContain(
    'data-language="ts"',
  )
  expect(renderToStaticMarkup(pre as React.ReactElement)).toContain(
    'data-raw-code="const foo = 1"',
  )
})
