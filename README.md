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

```
pnpm add blackwork
```

This package contains some `peerDependencies` that need to be installed together:

```
pnpm add @bassist/utils clsx react tailwindcss tailwind-merge tailwindcss-animate
```

## Usage

In your root layout:

```tsx
// e.g. `src/app/layout.tsx`
import 'blackwork/ui-globals.css'
```

In your layout or other components:

```tsx
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  ExternalLink,
  LayoutFooter,
  LayoutHeader,
  ScrollToTop,
} from 'blackwork'
```

There is no documentation yet, please refer to the component Props in the [source code](https://github.com/chengpeiquan/blackwork/tree/main/src) for usage.
