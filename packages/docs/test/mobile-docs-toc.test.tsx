/** @vitest-environment jsdom */

import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test, vi } from 'vitest'
import { MobileDocsToc } from '../src/theme/components/docs-toc'

vi.hoisted(() => {
  window.matchMedia = (query) =>
    ({
      matches: false,
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }) as MediaQueryList
})

const headings = [{ id: 'overview', depth: 2, title: 'Overview' }]

test('keeps the default outline and renders the shared glass material when requested', () => {
  const render = (triggerVariant?: 'glass') =>
    renderToStaticMarkup(
      <MobileDocsToc headings={headings} triggerVariant={triggerVariant} />,
    )

  expect(render()).toContain('bg-background')
  expect(render()).not.toContain('bw-glass-material')
  const glass = render('glass')
  expect(glass).toContain('bw-glass-control')
  expect(glass).toContain('data-material="clear"')
  expect(glass).not.toContain('bg-background')
  expect(glass.match(/<button\b/gu)).toHaveLength(1)
})

test('opens the outline with the glass button and closes it after selecting a heading', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  try {
    await act(async () => {
      root.render(<MobileDocsToc headings={headings} triggerVariant="glass" />)
    })
    const trigger = container.querySelector<HTMLButtonElement>(
      '[data-docs-toc-mobile-trigger]',
    )!
    await act(async () => trigger.click())
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    const link = document.querySelector<HTMLAnchorElement>(
      '[role="dialog"] a[href="#overview"]',
    )
    expect(link).not.toBeNull()
    await act(async () => link!.click())
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  } finally {
    await act(async () => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
  }
})
