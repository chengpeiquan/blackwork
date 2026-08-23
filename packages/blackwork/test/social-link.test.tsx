import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { SocialLink } from '../src/components/widgets/social-link'

test('renders one accessible external link without a nested button', () => {
  const html = renderToStaticMarkup(
    <SocialLink
      type="github"
      link="https://github.com/chengpeiquan/blackwork"
      label="GitHub"
      ariaLabel="在 GitHub 查看源码"
    />,
  )

  expect(html).toContain('aria-label="在 GitHub 查看源码"')
  expect(html.match(/<a\b/gu)).toHaveLength(1)
  expect(html).not.toContain('<button')
})
