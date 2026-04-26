import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  LayoutMain,
} from 'blackwork/rsc'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'

test('rsc entry exposes server-renderable blackwork primitives', () => {
  const html = renderToStaticMarkup(
    <LayoutMain>
      <Alert>
        <AlertTitle>Blackwork Note</AlertTitle>
        <AlertDescription>Rendered from the RSC entry.</AlertDescription>
      </Alert>

      <Button>Continue</Button>
    </LayoutMain>,
  )

  expect(html).toContain('Blackwork Note')
  expect(html).toContain('Rendered from the RSC entry.')
  expect(html).toContain('Continue')
  expect(html).toContain('<main')
})
