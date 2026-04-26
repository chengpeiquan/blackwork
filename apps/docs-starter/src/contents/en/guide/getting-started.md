---
title: Getting Started
description: Start the starter locally and learn where sections, locales, and page files live.
order: 2
---

# Getting Started

The starter reads Markdown and MDX files from `src/contents/<locale>` and lets
`@blackwork/docs` handle routing, rendering, and metadata.

## Install

```bash title="pnpm"
pnpm install
```

## Run the starter

```bash title="pnpm"
pnpm --filter @blackwork/docs-starter dev
```

## Know the config split

- `content.config.ts` controls content root, locales, sections, and sidebars.
- `docs.config.ts` controls site copy and MDX component wiring.
- `src/contents/**` stores the actual Markdown and MDX pages.

## Understand the directory model

```text
src/contents/
  en/
    guide/
    reference/
  zh/
    guide/
    reference/
```

The first directory after the locale becomes the section key. That means:

- `src/contents/en/guide/getting-started.md` becomes `/guide/getting-started`
- `src/contents/en/reference/configuration.mdx` becomes
  `/reference/configuration`

## Validate the route model

Open these routes and compare what you see:

- `/` and `/zh`
- `/guide` and `/zh/guide`
- `/reference/configuration` and `/zh/reference/configuration`

Only non-default locales appear in the URL, and each section can render with a
different layout.
