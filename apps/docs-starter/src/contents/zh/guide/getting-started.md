---
title: 快速开始
description: 启动 starter，并理解 sections、locale 和内容目录的基础结构。
order: 2
---

# 快速开始

这个 starter 会读取 `src/contents/<locale>` 下的 Markdown / MDX 文件，并交给
`@blackwork/docs` 处理路由、渲染和元数据。

## 安装依赖

```bash title="pnpm"
pnpm install
```

## 启动站点

```bash title="pnpm"
pnpm --filter @blackwork/docs-starter dev
```

## 先理解配置分工

- `content.config.ts` 负责内容根目录、locale、sections 和 sidebar。
- `docs.config.ts` 负责站点文案和 MDX 组件映射。
- `src/contents/**` 负责实际的 Markdown / MDX 内容。

## 理解目录模型

```text
src/contents/
  en/
    guide/
    reference/
  zh/
    guide/
    reference/
```

locale 后面的第一级目录就是 section key，也就是说：

- `src/contents/en/guide/getting-started.md` 会生成
  `/guide/getting-started`
- `src/contents/en/reference/configuration.mdx` 会生成
  `/reference/configuration`

## 验证路由与布局

可以直接打开下面几组路由对比效果：

- `/` 和 `/zh`
- `/guide` 和 `/zh/guide`
- `/reference/configuration` 和 `/zh/reference/configuration`

只有非默认语言会显式出现在 URL 中，同时不同 section 可以渲染不同布局。
