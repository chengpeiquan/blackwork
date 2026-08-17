'use client'

import { ThemeToggle } from 'blackwork'
import { Example } from '../components/example'
import { PropsTable } from '../components/props-table'

const basicCode = `import { ThemeProvider, ThemeToggle } from 'blackwork'

export const Example = () => {
  return (
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  )
}`

const dropdownCode = `import { ThemeToggle } from 'blackwork'

export const Example = () => {
  return <ThemeToggle mode="dropdown" />
}`

export const ThemeBasicExample = () => (
  <Example title="Usage" code={basicCode}>
    <ThemeToggle />
  </Example>
)

export const ThemeDropdownExample = () => (
  <Example title="Dropdown" code={dropdownCode}>
    <ThemeToggle mode="dropdown" />
  </Example>
)

export const ThemePropsTable = () => (
  <PropsTable
    rows={[
      {
        name: 'defaultTheme',
        type: '"light" | "dark"',
        defaultValue: '"dark"',
        description: 'Initial theme on ThemeProvider.',
      },
      {
        name: 'storageKey',
        type: 'string',
        defaultValue: '"blackwork-theme"',
        description: 'localStorage key on ThemeProvider.',
      },
      {
        name: 'mode',
        type: '"button" | "dropdown"',
        defaultValue: '"button"',
        description: 'Interaction on ThemeToggle.',
      },
      {
        name: 'options',
        type: 'ThemeToggleOption[]',
        description: 'Custom labels and icons for ThemeToggle.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        description: 'Accessible name for ThemeToggle.',
      },
    ]}
  />
)
