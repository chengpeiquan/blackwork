---
title: 内容目录结构
description: 说明 locale 与 section 如何从目录结构映射为路由。
order: 2
---

# 内容目录结构

这个 starter 保持内容目录足够显式，这样用户能直接看懂文件路径和站点路由之间
的关系。

## 推荐结构

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

## 路由示例

- `src/contents/en/index.mdx` 会生成 `/`
- `src/contents/zh/index.mdx` 会生成 `/zh`
- `src/contents/en/guide/index.mdx` 会生成 `/guide`
- `src/contents/en/reference/configuration.mdx` 会生成
  `/reference/configuration`

尽量让不同 locale 保持相同的目录结构，这样语言切换时就能稳定落到对应页面。
