import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { defaultComponents, mergeComponents } from '../src'

const CustomLink: React.FC<React.PropsWithChildren<{ href?: string }>> = ({
  children,
  href,
}) => (
  <a href={href} data-custom-link={href}>
    {children}
  </a>
)

test('mergeComponents preserves defaults and lets later layers override earlier ones', () => {
  const components = mergeComponents(defaultComponents, { a: CustomLink })

  expect(components.pre).toBe(defaultComponents.pre)
  expect(components.a).toBe(CustomLink)

  const html = renderToStaticMarkup(
    React.createElement(components.a, { href: '/docs' }, 'Docs'),
  )

  expect(html).toContain('data-custom-link="/docs"')
})
