# Docs Starter

`apps/docs-starter` is the reference template for `@blackwork/docs`.

It shows the intended split between:

- `content.config.ts` for content root and locale configuration
- `docs.config.ts` for site copy and MDX component wiring
- `src/contents/**` for Markdown and MDX content
- `src/app/layout.tsx` and `src/app/[[...slug]]/page.tsx` as thin Next.js wrappers
- `src/mdx/components/**` for local MDX component overrides

## Commands

```bash
pnpm --filter @blackwork/docs-starter dev
pnpm --filter @blackwork/docs-starter build
pnpm --filter @blackwork/docs-starter build:static
pnpm --filter @blackwork/docs-starter start
pnpm --filter @blackwork/docs-starter start:static
pnpm --filter @blackwork/docs-starter test
```

The starter prebuilds `@blackwork/docs` before `dev`, `build`, `build:static`, and `test`, so local package changes are picked up automatically.

Use `start` to preview the regular Next.js server build in `.next-build`.
Use `start:static` after `build:static` to preview the static export in `.next-static` (including `pagefind` assets).

## Required Files

```text
content.config.ts
docs.config.ts
src/app/layout.tsx
src/app/[[...slug]]/page.tsx
src/contents/
src/mdx/components/
```

## Template Shape

```text
src/
  app/
    layout.tsx
    [[...slug]]/
      page.tsx
      redirects/
  contents/
    en/
      index.mdx
      guide/getting-started.md
    zh/
      index.mdx
      guide/getting-started.md
  mdx/
    components/
      callout.tsx
      code-block.tsx
      fade-preview.tsx
```

## Configuration

Edit `content.config.ts` to control:

- default locale and locale list
- default-locale redirect behavior
- optional section layouts by top-level content directory
- optional manual sidebars for docs sections

Edit `docs.config.ts` to control:

- site title and description
- MDX component overrides

`next.config.ts` auto-discovers `content.config.ts` through
`withBlackworkDocs()`, so the starter no longer needs any manual content-config
imports.

Content stays in `src/contents/**`; app code should stay thin.

If a project later needs blog-style pages alongside docs-style pages, add
section rules in `content.config.ts`:

```ts
export const docsContentConfig = {
  root: 'src/contents',
  defaultLocale: 'en',
  sections: {
    guide: {
      layout: 'docs',
    },
    article: {
      layout: 'content',
    },
  },
}
```

`guide/**` will keep the docs sidebar, while `article/**` will render the
content layout without it.

If a docs section needs curated learning paths or external resources, replace
the automatic sidebar with a manual tree:

```ts
export const docsContentConfig = {
  root: 'src/contents',
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

The configured tree becomes the source of truth for that section's left
sidebar, docs header/footer navigation, and pager order. External links stay in
the sidebar but are skipped by the pager. Missing internal pages fail fast with
an error that names the section, locale, and bad `href`.

## Tailwind

The starter scans both package build outputs so runtime classes from the docs package are included:

```ts
content: [
  './src/**/*.{js,mjs,cjs,ts,jsx,tsx,md,mdx}',
  './node_modules/blackwork/dist/**/*.{js,mjs,cjs}',
  './node_modules/@blackwork/docs/dist/**/*.{js,mjs,cjs}',
]
```
