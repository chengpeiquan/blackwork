# @blackwork/docs

<p>
  <a href='https://www.npmjs.com/package/@blackwork/docs'>
    <img src="https://img.shields.io/npm/v/@blackwork/docs?color=333&label=npm" />
  </a>
  <a href="https://www.npmjs.com/package/@blackwork/docs" target="__blank">
    <img src="https://img.shields.io/npm/dt/@blackwork/docs?color=333&label=downloads" />
  </a>
  <a href="https://github.com/chengpeiquan/blackwork" target="__blank">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/chengpeiquan/blackwork?style=social" />
  </a>
</p>

`@blackwork/docs` is a Next.js-first documentation framework for the Blackwork ecosystem.

It sits one layer above `blackwork` and `@blackwork/machine`:

- `blackwork` provides the UI base and Tailwind theme.
- `@blackwork/machine` provides Markdown and MDX compilation.
- `@blackwork/docs` provides the docs-site runtime: content discovery, locale-aware routing, metadata, navigation, theme shells, and the public Next.js entry surface.

## Install

```bash
pnpm add @blackwork/docs blackwork next react react-dom
```

## Recommended Project Shape

```text
my-docs/
  content.config.ts
  contents/
    en/
      index.mdx
      guide/getting-started.mdx
    zh/
      index.mdx
  docs.config.ts
  src/
    app/
      layout.tsx
      [[...slug]]/
        page.tsx
    mdx/
      components/
        callout.tsx
```

The required app-facing files are intentionally thin:

- `next.config.ts` wraps the app with `withBlackworkDocs()`.
- `content.config.ts` defines pure content settings such as content root,
  locales, and section behavior.
- `docs.config.ts` defines site and MDX component configuration.
- `src/app/layout.tsx` mounts `DocsRootLayout`.
- `src/app/[[...slug]]/page.tsx` delegates page rendering, metadata, and static params to `@blackwork/docs`.
- `contents/**` stores the actual docs content.

## Minimal Config

`content.config.ts`

```ts
export const docsContentConfig = {
  root: 'contents',
  defaultLocale: 'en',
  enableDefaultLocaleRedirect: true,
  locales: {
    en: {
      code: 'en',
      label: 'English',
    },
    zh: {
      code: 'zh',
      label: '简体中文',
    },
  },
}
```

Optional section behavior can also stay in `content.config.ts` when different
top-level content directories need different layouts:

```ts
export const docsContentConfig = {
  root: 'contents',
  defaultLocale: 'en',
  sections: {
    guide: {
      layout: 'docs',
      sidebar: 'auto',
    },
    reference: {
      layout: 'docs',
      sidebar: 'auto',
    },
    article: {
      layout: 'content',
    },
  },
}
```

The first directory under `contents/<locale>/` is treated as the section key.
`layout: 'docs'` keeps the left docs sidebar, while `layout: 'content'` renders
the article without that sidebar. Home pages still use the dedicated landing
shell.

## Manual Sidebars

Docs sections can replace the generated sidebar with a manual tree in
`content.config.ts`:

```ts
export const docsContentConfig = {
  root: 'contents',
  defaultLocale: 'en',
  sections: {
    guide: {
      layout: 'docs',
      sidebar: [
        {
          type: 'group',
          label: {
            en: 'Foundations',
            zh: '基础',
          },
          items: [
            {
              type: 'item',
              href: '/guide',
            },
            {
              type: 'item',
              href: '/guide/getting-started',
              label: {
                en: 'Quickstart',
                zh: '快速开始',
              },
            },
          ],
        },
        {
          type: 'group',
          label: {
            en: 'Resources',
            zh: '资源',
          },
          items: [
            {
              type: 'item',
              href: 'https://example.com/changelog',
              label: {
                en: 'Changelog',
                zh: '更新日志',
              },
            },
          ],
        },
      ],
    },
  },
}
```

Rules for the first manual-sidebar slice:

- `sidebar` accepts `'auto'`, `false`, or an array of `group` / `item` nodes.
- Manual sidebars fully replace automatic sidebar generation for that section.
- Internal `href` values should use full docs paths such as
  `'/guide/getting-started'`.
- Internal item `label` is optional. When omitted, the current locale falls
  back to the linked page title.
- Localized labels fall back to `defaultLocale` when the current locale key is
  missing.
- External items stay visible in the sidebar, but the pager skips them.
- Pager order follows the manual tree depth-first across groups.

Manual internal links validate eagerly against the docs source for the current
locale. A missing page throws an actionable error like:

```txt
[blackwork-docs] Invalid sidebar item in section "guide": href "/guide/design" does not match any document entry in locale "en". Add the page or remove the sidebar item.
```

`docs.config.ts`

```ts
import { defineDocsConfig } from '@blackwork/docs'
import { Callout } from './src/mdx/components/callout'

export const docsConfig = defineDocsConfig({
  site: {
    title: 'My Docs',
    description: 'Project documentation powered by Blackwork Docs.',
  },
  mdx: {
    components: {
      Callout,
    },
  },
})
```

## Next.js Entry Files

`next.config.ts`

```ts
import type { NextConfig } from 'next'
import { withBlackworkDocs } from '@blackwork/docs/next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ['blackwork'],
}

export default withBlackworkDocs()(nextConfig)
```

The wrapper generates a docs manifest under `.blackwork/docs` and keeps it in
sync during development so Markdown and MDX changes participate in the Next
module graph instead of relying on client polling.

`withBlackworkDocs()` auto-discovers the root-level `content.config.ts` file.
Keep that file pure data only. Runtime-only configuration such as MDX component
overrides should stay in `docs.config.ts`.

`src/app/layout.tsx`

```tsx
import { DocsRootLayout } from '@blackwork/docs'
import { docsConfig } from '../../docs.config'
import './globals.css'

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ slug?: string[] }>
}>) {
  return (
    <DocsRootLayout config={docsConfig} params={params}>
      {children}
    </DocsRootLayout>
  )
}
```

`src/app/[[...slug]]/page.tsx`

```tsx
import {
  DocsPage,
  generateMetadata as generateDocsMetadata,
  generateStaticParams as generateDocsStaticParams,
} from '@blackwork/docs'
import { notFound, redirect } from 'next/navigation'
import { docsConfig } from '../../../docs.config'

const rootDir = '.'

export const dynamicParams = false

export async function generateStaticParams() {
  return generateDocsStaticParams({
    config: docsConfig,
    rootDir,
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  return generateDocsMetadata({
    config: docsConfig,
    params,
    rootDir,
  })
}

export default function DocsRoutePage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  return DocsPage({
    config: docsConfig,
    onNotFound: () => notFound(),
    onRedirect: (href) => redirect(href),
    params,
    rootDir,
  })
}
```

## Tailwind Setup

### Tailwind CSS v3

If your app uses Tailwind CSS, include both `blackwork` and `@blackwork/docs` build output in the content scan:

```ts
import typography from '@tailwindcss/typography'
import { theme } from 'blackwork/tailwind-config'
import animate from 'tailwindcss-animate'
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'selector',
  content: [
    './src/**/*.{js,mjs,cjs,ts,jsx,tsx,mdx}',
    './contents/**/*.{md,mdx}',
    './node_modules/blackwork/dist/**/*.{js,mjs,cjs}',
    './node_modules/@blackwork/docs/dist/**/*.{js,mjs,cjs}',
  ],
  theme,
  plugins: [typography, animate],
} satisfies Config
```

### Tailwind CSS v4

Import the Blackwork and docs package Tailwind entries explicitly:

```css
@import 'tailwindcss';
@import 'blackwork/tailwind.css';
@import '@blackwork/docs/tailwind.css';
```

## Difference From `@blackwork/machine`

Use `@blackwork/machine` when you only need Markdown or MDX compilation:

- Markdown / MDX compilation
- component merging
- lightweight Next adapter support

Use `@blackwork/docs` when you need a full docs-site runtime:

- content directory indexing
- locale-aware route resolution
- static params and metadata generation
- sidebar, pager, locale links, and default shells
- thin Next.js integration surface from the root package entry
