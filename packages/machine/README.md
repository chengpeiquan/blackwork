# @blackwork/machine

`@blackwork/machine` is a tattoo-machine-inspired Markdown and MDX engine designed specifically for the Blackwork React UI ecosystem. It is built to power Blackwork-based blogs and documentation sites, rather than to serve as a fully generic content framework.

## Usage

```tsx
import { Markdown, compile } from '@blackwork/machine'

const result = await compile(`# Hello`)

// Server component usage
await Markdown({ source: '# Hello' })
```

## Default Components

`@blackwork/machine` ships with a default renderer for common Markdown / MDX
elements. You can use the built-in mapping directly or merge your own overrides
on top of it.

```tsx
import { defaultComponents, mergeComponents } from '@blackwork/machine'

const components = mergeComponents(defaultComponents, {
  a: CustomLink,
})

await Markdown({
  source: '# Hello',
  components,
})
```

## Next Adapter

For Next.js projects, `@blackwork/machine/next-adapter` provides a small helper
layer for injecting `next/image`, navigation links, and a project-specific
`CodeBlock` wrapper without hard-binding the core package to Next.js.

```tsx
import { createNextComponents } from '@blackwork/machine/next-adapter'
import Image from 'next/image'
import { ExternalLink, Link } from '@/navigation'
import { CodeBlock } from '@/core/parser/components/code-block'

const components = createNextComponents({
  CodeBlock,
  ExternalLink,
  Image,
  Link,
})

await Markdown({
  source: '# Hello',
  components,
})
```

If your app uses Tailwind CSS and consumes runtime components from this package,
remember to include the package files in your `content` globs:

```ts
export default {
  content: [
    './src/**/*.{js,mjs,cjs,ts,jsx,tsx,mdx}',
    './node_modules/@blackwork/machine/**/*.{js,mjs,cjs,ts,jsx,tsx,mdx}',
  ],
}
```
