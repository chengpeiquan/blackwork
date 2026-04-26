# blackwork workspace

This repository is now a pnpm workspace for the Blackwork ecosystem.

## Packages

- `blackwork`
  Blackwork Tattoo style React UI layout for blogs, documentation sites, and other content-driven websites.
- `@blackwork/machine`
  A tattoo-machine-inspired Markdown and MDX engine for the Blackwork React UI ecosystem.
- `@blackwork/docs`
  A Next.js-first docs framework built on top of `blackwork` and `@blackwork/machine`.

## Layering

- `blackwork` provides the UI primitives, shared styles, and Tailwind theme.
- `@blackwork/machine` handles Markdown and MDX compilation plus renderer merging.
- `@blackwork/docs` adds the docs product layer: content discovery, locale-aware routing, metadata, navigation, theme shells, and the Next.js entry surface.

If you are building a documentation site, start with `@blackwork/docs`.
Use `@blackwork/machine` directly only when you want Markdown or MDX rendering without the docs-site runtime.

## Starter

`apps/docs-starter` is the reference template for the current `@blackwork/docs` package.

Key template files:

- `apps/docs-starter/docs.config.ts`
- `apps/docs-starter/src/app/layout.tsx`
- `apps/docs-starter/src/app/[[...slug]]/page.tsx`
- `apps/docs-starter/src/contents/**`
- `apps/docs-starter/src/mdx/components/**`

## Development

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```

The original `blackwork` package source now lives in `packages/blackwork`.
