/** @vitest-environment jsdom */

import React, { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { TopProgress } from '../src/components/ui/top-progress'

let container: HTMLDivElement
let root: Root

const render = (pending: boolean, delay = 150) =>
  act(() =>
    root.render(
      <StrictMode>
        <TopProgress pending={pending} delay={delay} label="Loading page" />
      </StrictMode>,
    ),
  )
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms))
const bar = () => container.querySelector('[data-slot="top-progress"]')
const indicator = () =>
  container.querySelector<HTMLElement>('[data-slot="top-progress-indicator"]')

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  vi.useFakeTimers()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.useRealTimers()
})

test('server rendering is empty even when initially pending', () => {
  expect(renderToString(<TopProgress pending />)).toBe('')
})

test('fast work never flashes a completion bar', () => {
  render(true)
  advance(100)
  render(false)
  advance(2000)
  expect(bar()).toBeNull()
  expect(vi.getTimerCount()).toBe(0)
})

test('shows delayed indeterminate feedback and never finishes while pending', () => {
  render(true)
  advance(149)
  expect(bar()).toBeNull()
  advance(1)
  expect(bar()?.getAttribute('role')).toBe('progressbar')
  expect(bar()?.getAttribute('aria-label')).toBe('Loading page')
  expect(bar()?.hasAttribute('aria-valuenow')).toBe(false)
  advance(60000)
  const scale = Number(indicator()?.style.transform.match(/[\d.]+/u)?.[0])
  expect(scale).toBeGreaterThan(0.08)
  expect(scale).toBeLessThanOrEqual(0.9)
  expect(bar()?.getAttribute('data-state')).toBe('running')
})

test('clearing pending completes, fades and removes the bar', () => {
  render(true)
  advance(150)
  render(false)
  advance(0)
  expect(indicator()?.style.transform).toBe('scaleX(1)')
  expect(bar()?.getAttribute('aria-hidden')).toBe('true')
  advance(200)
  expect(bar()?.getAttribute('data-state')).toBe('fading')
  advance(200)
  expect(bar()).toBeNull()
  expect(vi.getTimerCount()).toBe(0)
})

test('new work during fade cancels stale completion and remains visible', () => {
  render(true)
  advance(150)
  render(false)
  advance(250)
  render(true)
  advance(0)
  expect(bar()?.getAttribute('data-state')).toBe('running')
  advance(2000)
  expect(bar()?.getAttribute('role')).toBe('progressbar')
  render(false)
  advance(400)
  expect(bar()).toBeNull()
})

test('unmount cleans up both delayed starts and active work', () => {
  render(true)
  act(() => root.render(null))
  expect(vi.getTimerCount()).toBe(0)
  render(true, 0)
  advance(0)
  expect(bar()).not.toBeNull()
  act(() => root.render(null))
  expect(vi.getTimerCount()).toBe(0)
})

test('independent instances do not end one another', () => {
  act(() =>
    root.render(
      <>
        <TopProgress pending delay={0} label="First" />
        <TopProgress pending delay={0} label="Second" />
      </>,
    ),
  )
  advance(0)
  act(() =>
    root.render(
      <>
        <TopProgress pending={false} delay={0} label="First" />
        <TopProgress pending delay={0} label="Second" />
      </>,
    ),
  )
  advance(400)
  expect(container.querySelectorAll('[role="progressbar"]')).toHaveLength(1)
  expect(bar()?.getAttribute('aria-label')).toBe('Second')
})
