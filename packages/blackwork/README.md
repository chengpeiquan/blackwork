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

Blackwork Tattoo style React UI layout for blogs, documentation sites, and other content-driven websites.

## Install

With `pnpm` (or `npm` or `yarn`):

```bash
pnpm add blackwork @bassist/utils clsx react tailwindcss tailwind-merge tailwindcss-animate
```

If you use the Tailwind example below, install the typography plugin as well:

```bash
pnpm add -D @tailwindcss/typography
```

These are optional and only need to be installed if the corresponding subpath is used:

```bash
# For `blackwork/form`
pnpm add @tanstack/react-form
```

## Usage

### Tailwind CSS v3

In your `tailwind.config.ts`:

```ts
import { createBlackworkTailwindConfig } from 'blackwork/tailwind-config'
import typography from '@tailwindcss/typography'
import animate from 'tailwindcss-animate'

export default createBlackworkTailwindConfig({
  rootDir: import.meta.url,
  content: [
    'src/app/**/*.{js,mjs,cjs,ts,jsx,tsx,mdx}',
    'src/components/**/*.{js,mjs,cjs,ts,jsx,tsx,mdx}',
    'content/**/*.{js,mjs,cjs,ts,jsx,tsx,mdx}',
  ],
  plugins: [typography, animate],
})
```

If you only need the shared theme tokens and want to assemble the rest yourself, `theme` is also exported from `blackwork/tailwind-config`.

In your root layout:

```tsx
// e.g. `src/app/layout.tsx`
import 'blackwork/ui-globals.css'
```

### Tailwind CSS v4

Tailwind CSS v4 users do not need `blackwork/tailwind-config`. Import Tailwind and the Blackwork v4 CSS entry from your app stylesheet:

```css
@import 'tailwindcss';
@import 'blackwork/tailwind.css';
```

Set `--blackwork-font-sans` in your app stylesheet if you want to override Tailwind v4's `font-sans` token.

If you only need the shared theme tokens and globals without scanning Blackwork components, import the lower-level CSS entries directly:

```css
@import 'blackwork/theme.css';
@import 'blackwork/ui-globals.css';
```

In your layout or other components:

```tsx
// e.g. `src/app/page.tsx` or an MDX component
import {
  Alert,
  AlertDescription,
  AlertTitle,
  LayoutFooter,
  LayoutMain,
} from 'blackwork/rsc'

export default function Page() {
  return (
    <LayoutMain>
      <Alert>
        <AlertTitle>Blackwork</AlertTitle>
        <AlertDescription>
          Use the `blackwork/rsc` entry in server components when you only need
          server-renderable primitives.
        </AlertDescription>
      </Alert>

      <LayoutFooter />
    </LayoutMain>
  )
}
```

In client components:

```tsx
'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  ScrollToTop,
  ThemeToggle,
  useKeyword,
} from 'blackwork'

// Icons
import { Moon, Sun } from 'blackwork/icons'

// Form (TanStack Form + Field)
import { FieldGroup, Form, useAppForm } from 'blackwork/form'

export function ExampleForm() {
  const form = useAppForm({
    defaultValues: { email: '' },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <Form form={form}>
      <FieldGroup>
        <form.AppField
          name="email"
          children={(field) => <field.TextField label="Email" type="email" />}
        />
      </FieldGroup>
      <form.AppForm>
        <form.SubmitButton>Save</form.SubmitButton>
      </form.AppForm>
    </Form>
  )
}
```

## Documentation

There is no dedicated documentation site yet. Most primitive component usage follows [shadcn/ui](https://ui.shadcn.com/docs/components) patterns.

For the package-specific APIs, refer to the props and examples in the [source code](https://github.com/chengpeiquan/blackwork/tree/main/packages/blackwork/src).
