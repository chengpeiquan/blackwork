import { describe, expect, test, vi } from 'vitest'
import {
  resetDocsScroll,
  shouldResetDocsScroll,
} from '../src/theme/components/docs-scroll-reset'

describe('shouldResetDocsScroll', () => {
  test('does not reset on the initial pathname render', () => {
    expect(shouldResetDocsScroll(null, '/guide/getting-started')).toBe(false)
  })

  test('does not reset when the pathname does not change', () => {
    expect(
      shouldResetDocsScroll('/guide/getting-started', '/guide/getting-started'),
    ).toBe(false)
  })

  test('resets when the pathname changes', () => {
    expect(
      shouldResetDocsScroll(
        '/guide/getting-started',
        '/reference/configuration',
      ),
    ).toBe(true)
  })

  test('forces an instant top reset to avoid smooth-scroll drift', () => {
    const scrollTo = vi.fn<(options: ScrollToOptions) => void>()

    resetDocsScroll({
      scrollTo,
    })

    expect(scrollTo).toHaveBeenCalledWith({
      left: 0,
      top: 0,
      behavior: 'instant',
    })
  })
})
