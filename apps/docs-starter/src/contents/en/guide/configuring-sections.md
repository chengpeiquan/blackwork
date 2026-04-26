---
title: Configuring Sections
description: Learn how top-level content directories map to section rules in content.config.ts.
order: 3
---

# Configuring Sections

`sections` lets you assign behavior to the first directory under
`src/contents/<locale>/`.

## Starter example

```ts title="content.config.ts"
export const docsContentConfig = {
  root: 'src/contents',
  defaultLocale: 'en',
  enableDefaultLocaleRedirect: true,
  locales: {
    en: { code: 'en', label: 'English' },
    zh: { code: 'zh', label: '简体中文' },
  },
  sections: {
    guide: {
      layout: 'docs',
      sidebar: [
        {
          type: 'group',
          label: {
            en: 'Learn The Setup',
            zh: '学习配置方式',
          },
          items: [
            { type: 'item', href: '/guide' },
            { type: 'item', href: '/guide/getting-started' },
            { type: 'item', href: '/guide/configuring-sections' },
          ],
        },
      ],
    },
    reference: {
      layout: 'content',
    },
  },
}
```

## How to choose a layout

- Use `layout: 'docs'` for learning paths, tutorials, and any section that
  needs a docs sidebar.
- Use `layout: 'content'` for article-like or reference-like pages that should
  focus on reading.

## How the sidebar works

When you provide `sidebar`, that tree becomes the source of truth for:

- the left docs navigation
- the pager order
- the grouped learning path

Internal `href` values must point to real pages in the same locale. This is why
the starter keeps the example links inside the repo instead of using placeholder
URLs.

## Add your own section

1. Create a new top-level directory under each locale, such as
   `src/contents/en/tutorials`.
2. Add a matching entry in `content.config.ts`.
3. Choose `layout: 'docs'` or `layout: 'content'`.
4. Add a manual sidebar only when you want a curated order instead of automatic
   navigation.
