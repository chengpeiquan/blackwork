---
title: 配置 Sections
description: 了解顶层内容目录如何映射到 content.config.ts 里的 section 规则。
order: 3
---

# 配置 Sections

`sections` 用来给 `src/contents/<locale>/` 下的第一级目录配置行为。

## Starter 示例

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

## 怎么选择 layout

- `layout: 'docs'` 适合教程、学习路径、接入文档这类需要 sidebar 的内容。
- `layout: 'content'` 适合文章、参考页、说明页这类以阅读为主的内容。

## sidebar 会影响什么

当你手动提供 `sidebar` 时，这棵树会成为下面这些能力的来源：

- 左侧导航
- 上一页 / 下一页顺序
- 分组后的学习路径

内部 `href` 必须指向真实存在的页面，所以 starter 里的示例链接全部指向仓库内
已有内容，而不是占位 URL。

## 如何新增自己的 section

1. 先在每个 locale 下创建一个新的顶层目录，比如
   `src/contents/en/tutorials`。
2. 在 `content.config.ts` 中补一个同名 section。
3. 选择 `layout: 'docs'` 或 `layout: 'content'`。
4. 只有在你需要固定阅读顺序时，才提供手写 `sidebar`。
