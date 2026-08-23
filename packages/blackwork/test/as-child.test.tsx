import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test, vi } from 'vitest'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '../src/components/ui/tooltip'

test('renders an intrinsic asChild target without leaking Base UI props', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

  const html = renderToStaticMarkup(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>Project downloads</span>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>,
  )

  expect(html).toContain('<span')
  expect(html).toContain('Project downloads</span>')
  expect(html).not.toContain('<button')
  expect(html).not.toContain('nativeButton')
  expect(consoleError).not.toHaveBeenCalled()

  consoleError.mockRestore()
})
