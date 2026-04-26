import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, test } from 'vitest'
import { DocsPage, defineConfig } from '../src/index'

const fixtures = new Set<string>()

const createFixture = () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'blackwork-docs-shell-'))
  fixtures.add(rootDir)

  const write = (relativePath: string, source: string) => {
    const filePath = join(rootDir, relativePath)
    mkdirSync(join(filePath, '..'), { recursive: true })
    writeFileSync(filePath, source)
  }

  write(
    'contents/en/index.mdx',
    `---
title: Overview
order: 1
---

# Overview
`,
  )

  write(
    'contents/en/guide/getting-started.md',
    `---
title: Getting Started
description: Mount the starter.
order: 2
---

# Getting Started

## Install

Run the install command.

## Run the starter

Start the development server.

### Validate the route model

Check canonical routes.
`,
  )

  return rootDir
}

afterEach(() => {
  for (const fixture of fixtures) {
    rmSync(fixture, { recursive: true, force: true })
  }

  fixtures.clear()
})

describe('default docs shell', () => {
  test('marks the active sidebar page and renders document headings in a TOC', async () => {
    const rootDir = createFixture()
    const config = defineConfig({
      content: {
        defaultLocale: 'en',
      },
    })

    const element = await DocsPage({
      config,
      rootDir,
      params: {
        slug: ['guide', 'getting-started'],
      },
    })
    const html = renderToStaticMarkup(element as React.ReactElement)

    expect(html).toContain('data-docs-region="sidebar"')
    expect(html).toContain('data-docs-sidebar-scroll="true"')
    expect(html).toContain('data-docs-sidebar-fade="top"')
    expect(html).toContain('data-docs-sidebar-fade="bottom"')
    expect(html).toContain('lg:self-start')
    expect(html).toContain('lg:sticky')
    expect(html).toContain('lg:top-24')
    expect(html).toContain('lg:max-h-[calc(100dvh-6rem)]')
    expect(html).toContain('lg:overflow-auto')
    expect(html).toContain('lg:pb-8')
    expect(html).not.toContain('lg:py-8')
    expect(html).toContain('data-docs-region="header"')
    expect(html).toContain('sticky top-0')
    expect(html).toContain('h-16')
    expect(html).toContain('data-docs-region="toc"')
    expect(html).toContain('hidden w-64 xl:block')
    expect(html).toContain('shrink-0')
    expect(html).toContain('top-24')
    expect(html).toContain('data-docs-toc-track="true"')
    expect(html).toContain('data-docs-toc-thumb="true"')
    expect(html).toContain('data-docs-toc-item-line="true"')
    expect(html).toContain('data-docs-toc-item-curve="true"')
    expect(html).toContain('On This Page')
    expect(html).toContain('href="#install"')
    expect(html).toContain('href="#run-the-starter"')
    expect(html).toContain('href="#validate-the-route-model"')
    expect(html).toContain('data-depth="3"')
    expect(html).toContain('padding-inline-start:32px')
    expect(html).toContain('data-current-page="true"')
    expect(html).toContain('aria-current="page"')
  })
})
