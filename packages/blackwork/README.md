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

If the app already has React 19+ and Tailwind CSS v4, install this package:

```bash
pnpm add blackwork
```

Add this only when you use `blackwork/form`:

```bash
pnpm add @tanstack/react-form
```

## Usage

Import Tailwind and the Blackwork CSS entry from your app stylesheet:

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

// Icons: import from `lucide-react`. `blackwork/icons` has been removed.

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

## Icons

`blackwork/icons` is removed. Import generic icons from [`lucide-react`](https://lucide.dev) in your app:

```tsx
import { Moon, Search, Sun } from 'lucide-react'
```

Lucide 1.x no longer ships brand logos. Keep GitHub, X, Zhihu, npm, and similar marks next to the feature that needs them.

## Documentation

See the [documentation site](https://ui.chengpeiquan.com) for layouts, widgets, forms, theme, and the few primitives that add behavior on top of shadcn.

Most other primitive usage follows [shadcn/ui](https://ui.shadcn.com/docs/components) patterns.
