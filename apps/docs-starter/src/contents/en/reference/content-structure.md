---
title: Content Structure
description: The directory shape that maps locales and sections to routes.
order: 2
---

# Content Structure

This starter keeps the content tree explicit so users can understand how files
turn into routes.

## Recommended structure

```text
src/contents/
  en/
    index.mdx
    guide/
      index.mdx
      getting-started.md
      configuring-sections.md
      mdx-playground.mdx
    reference/
      configuration.mdx
      content-structure.md
  zh/
    index.mdx
    guide/
      index.mdx
      getting-started.md
      configuring-sections.md
      mdx-playground.mdx
    reference/
      configuration.mdx
      content-structure.md
```

## Route examples

- `src/contents/en/index.mdx` becomes `/`
- `src/contents/zh/index.mdx` becomes `/zh`
- `src/contents/en/guide/index.mdx` becomes `/guide`
- `src/contents/en/reference/configuration.mdx` becomes
  `/reference/configuration`

Keep the structure consistent across locales so locale switching can land on the
matching page.
