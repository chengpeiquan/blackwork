import { describe, expect, test } from 'vitest'
import {
  buildTocTrackGeometry,
  getTocGuideOffset,
  getTocItemPadding,
} from '../src/theme/components/docs-toc-geometry'

describe('docs toc geometry', () => {
  test('uses deeper guide offsets and paddings for nested headings', () => {
    expect(getTocGuideOffset(2)).toBe(8)
    expect(getTocGuideOffset(3)).toBe(16)
    expect(getTocGuideOffset(6)).toBe(40)
    expect(getTocItemPadding(2)).toBe(20)
    expect(getTocItemPadding(3)).toBe(32)
    expect(getTocItemPadding(6)).toBe(68)
  })

  test('builds a curved svg path that follows toc indentation', () => {
    const geometry = buildTocTrackGeometry([
      {
        bottom: 20,
        depth: 2,
        id: 'install',
        top: 0,
      },
      {
        bottom: 52,
        depth: 3,
        id: 'validate-the-route-model',
        top: 32,
      },
      {
        bottom: 84,
        depth: 4,
        id: 'nested-track',
        top: 64,
      },
    ])

    expect(geometry.width).toBe(32.5)
    expect(geometry.height).toBe(84)
    expect(geometry.path).toBe(
      'M8.5 0 L8.5 20 C 8.5 28 16.5 24 16.5 32 L16.5 52 C 16.5 60 24.5 56 24.5 64 L24.5 84',
    )
    expect(geometry.positions).toEqual([
      {
        bottom: 20,
        depth: 2,
        id: 'install',
        top: 0,
        x: 8.5,
      },
      {
        bottom: 52,
        depth: 3,
        id: 'validate-the-route-model',
        top: 32,
        x: 16.5,
      },
      {
        bottom: 84,
        depth: 4,
        id: 'nested-track',
        top: 64,
        x: 24.5,
      },
    ])
  })
})
