'use client'

import { Button } from 'blackwork'
import { Mail } from 'lucide-react'
import { Example } from '../components/example'
import { PropsTable } from '../components/props-table'

const basicCode = `import { Button } from 'blackwork'

export const Example = () => {
  return <Button>Button</Button>
}`

const variantsCode = `import { Button } from 'blackwork'

export const Example = () => {
  return (
    <>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </>
  )
}`

const sizesCode = `import { Button } from 'blackwork'
import { Mail } from 'lucide-react'

export const Example = () => {
  return (
    <>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Mail">
        <Mail />
      </Button>
    </>
  )
}`

const loadingCode = `import { Button } from 'blackwork'

export const Example = () => {
  return (
    <>
      <Button loading>Saving</Button>
      <Button variant="outline" loading>
        Saving
      </Button>
    </>
  )
}`

const asChildCode = `import Link from 'next/link'
import { Button } from 'blackwork'

export const Example = () => {
  return (
    <Button asChild>
      <Link href="/guide/getting-started">Get started</Link>
    </Button>
  )
}`

export const ButtonBasicExample = () => (
  <Example title="Usage" code={basicCode}>
    <Button>Button</Button>
  </Example>
)

export const ButtonVariantsExample = () => (
  <Example title="Variants" code={variantsCode}>
    <Button>Default</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="destructive">Destructive</Button>
    <Button variant="link">Link</Button>
  </Example>
)

export const ButtonSizesExample = () => (
  <Example title="Sizes" code={sizesCode}>
    <Button size="sm">Small</Button>
    <Button>Default</Button>
    <Button size="lg">Large</Button>
    <Button size="icon" aria-label="Mail">
      <Mail />
    </Button>
  </Example>
)

export const ButtonLoadingExample = () => (
  <Example title="Loading" code={loadingCode}>
    <Button loading>Saving</Button>
    <Button variant="outline" loading>
      Saving
    </Button>
  </Example>
)

export const ButtonAsChildExample = () => (
  <Example title="asChild" code={asChildCode}>
    <Button asChild>
      <a href="/guide/getting-started">Get started</a>
    </Button>
  </Example>
)

export const ButtonPropsTable = () => (
  <PropsTable
    rows={[
      {
        name: 'variant',
        type: '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"',
        defaultValue: '"default"',
        description: 'Visual style of the button.',
      },
      {
        name: 'size',
        type: '"default" | "sm" | "lg" | "icon"',
        defaultValue: '"default"',
        description:
          'Control height and padding. Use icon for square icon-only buttons.',
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Disables the button and shows a spinner.',
      },
      {
        name: 'loaderClassName',
        type: 'string',
        description: 'Extra classes for the spinner.',
      },
      {
        name: 'asChild',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Merge props onto the child instead of rendering a button. Do not combine with loading.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Native disabled state.',
      },
    ]}
  />
)
