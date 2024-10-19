# blackwork

<p>
  <a href='https://www.npmjs.com/package/blackwork'>
    <img src="https://img.shields.io/npm/v/blackwork?color=333&label=npm" />
  </a>
  <a href="https://www.npmjs.com/package/blackwork" target="__blank">
    <img src="https://img.shields.io/npm/dt/blackwork?color=333&label=downloads" />
  </a>
  <a href="https://github.com/chengpeiquan/blackwork" target="__blank">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/chengpeiquan/blackwork?style=social" />
  </a>
</p>

Blackwork Tattoo style React UI layout (provides a unified interface for websites like @chengpeiquan 's blog).

## Install

With `pnpm` (or `npm` or `yarn` ):

```bash
pnpm add blackwork
```

This package contains some `peerDependencies` that need to be installed together:

```bash
pnpm add @bassist/utils clsx react tailwindcss tailwind-merge tailwindcss-animate
```

These are optional and only need to be installed if the corresponding components are used.

```bash
# For `form`
pnpm add @hookform/resolvers react-hook-form
```

## Usage

In your `tailwind.config.ts`:

```ts
import { type Config } from 'tailwindcss'
import { theme } from 'blackwork/tailwind-config'
import typography from '@tailwindcss/typography'
import animate from 'tailwindcss-animate'

export default {
  darkMode: 'selector',
  content: [
    // e.g. in Next.js
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contents/**/*.{js,ts,jsx,tsx,mdx}',

    // This path is required!
    './node_modules/blackwork/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme,
  plugins: [typography(), animate],
} satisfies Config
```

In your root layout:

```tsx
// e.g. `src/app/layout.tsx`
import 'blackwork/ui-globals.css'
```

In your layout or other components:

```tsx
// e.g. `src/app/page.tsx`
import {
  // Components
  Avatar,
  AvatarFallback,
  AvatarImage,
  ExternalLink,
  LayoutFooter,
  LayoutHeader,
  ScrollToTop,

  // Hooks
  useKeyword,
} from 'blackwork'

// Icons
import { Moon, Sun } from 'blackwork/icons'
```

## Documentation

There is no documentation yet, but it base on [Shadcn UI](https://ui.shadcn.com/docs/components) , so the usage of some basic components can refer to it.

About other components, please refer to the component props in the [source code](https://github.com/chengpeiquan/blackwork/tree/main/src) for usage.
