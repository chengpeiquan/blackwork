import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { Button } from '../src/components/ui/button'

test('keeps space between button content by default', () => {
  const html = renderToStaticMarkup(
    <Button>
      <svg aria-hidden="true" />
      Save
    </Button>,
  )

  expect(html).toContain('gap-2')
})

test('does not add a gap to icon-only buttons', () => {
  const html = renderToStaticMarkup(
    <Button size="icon" aria-label="Save">
      <svg aria-hidden="true" />
    </Button>,
  )

  expect(html).toContain('gap-0')
  expect(html).not.toContain('gap-2')
})
