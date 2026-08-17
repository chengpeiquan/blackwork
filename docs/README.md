# Blackwork Docs Site

`docs` is the official Blackwork documentation site. It is built on
`@blackwork/docs` and deploys as a static export to GitHub Pages at
https://ui.chengpeiquan.com.

## Commands

From the workspace root:

```bash
pnpm dev
pnpm docs:build
pnpm docs:preview
```

`pnpm dev` starts the Next.js preview server on port 3300.
`pnpm docs:build` writes a static site to `docs/.next-static`.
`pnpm docs:preview` serves that static output on port 4300.
