import { describe, expect, test } from 'vitest'
import { getTocAutoScrollTop } from '../src/theme/components/docs-toc'

describe('getTocAutoScrollTop', () => {
  test('keeps the active item visible inside the toc scroll area', () => {
    expect(
      getTocAutoScrollTop({
        itemBottom: 220,
        itemTop: 196,
        margin: 12,
        scrollHeight: 400,
        scrollTop: 0,
        viewportHeight: 120,
      }),
    ).toBe(112)
  })

  test('does not move when the active item is already visible', () => {
    expect(
      getTocAutoScrollTop({
        itemBottom: 84,
        itemTop: 60,
        margin: 12,
        scrollHeight: 400,
        scrollTop: 20,
        viewportHeight: 120,
      }),
    ).toBe(20)
  })
})
