import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, test, vi } from 'vitest'

const nextLinkMock = vi.hoisted(() =>
  vi.fn<
    (
      props: React.PropsWithChildren<{ href: string; className?: string }>,
    ) => React.ReactElement
  >(
    ({
      children,
      href,
      ...props
    }: React.PropsWithChildren<{ href: string; className?: string }>) =>
      React.createElement(
        'next-link-mock',
        {
          ...props,
          href,
        },
        children,
      ),
  ),
)

vi.mock('next/link', () => ({
  default: nextLinkMock,
}))

afterEach(() => {
  nextLinkMock.mockClear()
})

describe('DefaultDocsLink', () => {
  test('delegates docs navigation to next/link', async () => {
    const { DefaultDocsLink } = await import('../src/theme/components/link')
    const html = renderToStaticMarkup(
      React.createElement(
        DefaultDocsLink,
        {
          href: '/guide/getting-started',
          className: 'docs-link',
        },
        'Get started',
      ),
    )

    expect(nextLinkMock).toHaveBeenCalledTimes(1)
    expect(nextLinkMock).toHaveBeenCalledWith(
      expect.objectContaining({
        href: '/guide/getting-started',
        className: 'docs-link',
        scroll: false,
        children: 'Get started',
      }),
      undefined,
    )
    expect(html).toContain('<next-link-mock')
  })
})
