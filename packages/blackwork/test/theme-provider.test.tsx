/**
 * @vitest-environment jsdom
 */

import React, { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

vi.hoisted(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

import { ThemeProvider, useTheme } from '../src/components/theme/theme-provider'
import { ThemeScript } from '../src/components/theme/theme-script'

const ThemeValue = () => {
  const { theme } = useTheme()

  return <span>{theme}</span>
}

let container: HTMLDivElement

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  localStorage.clear()
  document.documentElement.className = ''
  document.documentElement.style.colorScheme = ''
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  container.remove()
  vi.restoreAllMocks()
})

test('hydrates with the default theme before restoring the stored theme', async () => {
  localStorage.setItem('blackwork-theme', 'light')
  container.innerHTML = '<span>dark</span>'
  const recoverableErrors: unknown[] = []

  const root = hydrateRoot(
    container,
    <ThemeProvider>
      <ThemeValue />
    </ThemeProvider>,
    {
      onRecoverableError: (error) => recoverableErrors.push(error),
    },
  )

  await act(async () => {})

  expect(recoverableErrors).toEqual([])
  expect(container.textContent).toBe('light')
  expect(document.documentElement.classList.contains('light')).toBe(true)
  expect(document.documentElement.style.colorScheme).toBe('light')

  await act(async () => root.unmount())
})

test('keeps the inline theme script inert when rendered on the client', () => {
  const html = renderToStaticMarkup(<ThemeScript />)

  expect(html).toContain('type="text/plain"')
})
