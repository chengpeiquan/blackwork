import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { FluidGlass, GlassSurface } from '../src/components/effects'
import {
  lensPixel,
  nearestRect,
  springStep,
} from '../src/components/effects/fluid-glass-math'
import { Button } from '../src/components/ui/button'
import { Input } from '../src/components/ui/input'

const rects = [
  { x: 4, y: 4, width: 80, height: 40 },
  { x: 90, y: 4, width: 120, height: 40 },
  { x: 4, y: 50, width: 80, height: 40 },
]

test('resolves items across gaps and wrapped rows without losing the highlight', () => {
  expect(nearestRect(rects, 88, 20)).toBe(1)
  expect(nearestRect(rects, 40, 60)).toBe(2)
  expect(nearestRect([], 40, 60)).toBe(-1)
})

test('spring settles at its target across frame rates and reverses without resetting position', () => {
  for (const dt of [1 / 30, 1 / 60, 1 / 120]) {
    let state = { value: 0, velocity: 0 }
    for (let i = 0; i < 2 / dt; i++)
      state = springStep(state.value, state.velocity, 160, dt)
    expect(state.value).toBeCloseTo(160, 2)
    const before = state.value
    state = springStep(state.value, state.velocity, 0, dt)
    expect(state.value).toBeGreaterThan(0)
    expect(state.value).toBeLessThan(before)
  }
})

test('refraction preserves the center and bends opposite lens edges symmetrically', () => {
  expect(lensPixel(60, 20, 120, 40)).toEqual([128, 128])
  const left = lensPixel(6, 20, 120, 40)
  const right = lensPixel(114, 20, 120, 40)
  expect(left[0]).toBeGreaterThan(128)
  expect(left[0] + right[0]).toBeCloseTo(256)
})

test('server render preserves links and native selection semantics without browser globals', () => {
  const html = renderToStaticMarkup(
    <FluidGlass>
      <a href="/about" data-fluid-glass-item="" aria-current="page">
        About
      </a>
    </FluidGlass>,
  )
  expect(html).toContain('href="/about"')
  expect(html).toContain('aria-current="page"')
  expect(html).not.toContain('tabindex')
  expect(html).not.toContain('data:image')
})

test('glass button keeps asChild semantics and inputs keep native disabled behavior', () => {
  const html = renderToStaticMarkup(
    <Button variant="glass" asChild>
      <a href="/">Home</a>
    </Button>,
  )
  expect(html).toContain('bw-glass-control')
  expect(html).toContain('href="/"')
  expect(html).not.toContain('<button')
  const input = renderToStaticMarkup(
    <Input appearance="glass" aria-label="Search" disabled />,
  )
  expect(input).toContain('bw-glass-input')
  expect(input).toContain('disabled=""')
  expect(input).not.toContain('appearance=')
})

test('glass surface renders a decorative backdrop separately from its content', () => {
  const html = renderToStaticMarkup(
    <GlassSurface>
      <button>Play</button>
    </GlassSurface>,
  )
  expect(html).toContain('aria-hidden="true" class="bw-glass-material"')
  expect(html).toContain(
    '<div class="bw-glass-content"><button>Play</button></div>',
  )
})

test('wide bars and large panels keep a neutral center and refract their actual straight edges', () => {
  for (const [width, height, radius] of [
    [1800, 64, 22],
    [680, 512, 28],
  ]) {
    expect(lensPixel(width / 2, height / 2, width, height, radius)).toEqual([
      128, 128,
    ])
    const top = lensPixel(width / 2, 2, width, height, radius)
    const bottom = lensPixel(width / 2, height - 2, width, height, radius)
    expect(top[0]).toBe(128)
    expect(top[1]).toBeGreaterThan(180)
    expect(top[1] + bottom[1]).toBeCloseTo(256)
    expect(lensPixel(2, height / 2, width, height, radius)[0]).toBeGreaterThan(
      180,
    )
  }
})
