import { describe, expect, test } from 'vitest'
import { getDocsRailFadeState } from '../src/theme/components/docs-rail-scroll-state'

describe('getDocsRailFadeState', () => {
  test('hides both fades when the rail does not overflow', () => {
    expect(
      getDocsRailFadeState({
        scrollTop: 0,
        clientHeight: 320,
        scrollHeight: 320,
      }),
    ).toEqual({
      bottomVisible: false,
      topVisible: false,
    })
  })

  test('shows only the bottom fade when the rail starts at the top', () => {
    expect(
      getDocsRailFadeState({
        scrollTop: 0,
        clientHeight: 320,
        scrollHeight: 520,
      }),
    ).toEqual({
      bottomVisible: true,
      topVisible: false,
    })
  })

  test('shows both fades when the rail is scrolled through the middle', () => {
    expect(
      getDocsRailFadeState({
        scrollTop: 80,
        clientHeight: 320,
        scrollHeight: 520,
      }),
    ).toEqual({
      bottomVisible: true,
      topVisible: true,
    })
  })

  test('shows only the top fade when the rail is at the bottom', () => {
    expect(
      getDocsRailFadeState({
        scrollTop: 200,
        clientHeight: 320,
        scrollHeight: 520,
      }),
    ).toEqual({
      bottomVisible: false,
      topVisible: true,
    })
  })
})
