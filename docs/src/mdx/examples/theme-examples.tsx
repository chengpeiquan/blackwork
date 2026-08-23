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
  <Example title="Usage" titleZh="用法" code={basicCode}>
    <ThemeToggle />
  </Example>
)

export const ThemeDropdownExample = () => (
  <Example title="Dropdown" titleZh="下拉菜单" code={dropdownCode}>
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
        descriptionZh: 'ThemeProvider 的初始主题。',
      },
      {
        name: 'storageKey',
        type: 'string',
        defaultValue: '"blackwork-theme"',
        description: 'localStorage key on ThemeProvider.',
        descriptionZh: 'ThemeProvider 使用的 localStorage key。',
      },
      {
        name: 'mode',
        type: '"button" | "dropdown"',
        defaultValue: '"button"',
        description: 'Interaction on ThemeToggle.',
        descriptionZh: 'ThemeToggle 的交互模式。',
      },
      {
        name: 'options',
        type: 'ThemeToggleOption[]',
        description: 'Custom labels and icons for ThemeToggle.',
        descriptionZh: 'ThemeToggle 的自定义标签和图标。',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        description: 'Accessible name for ThemeToggle.',
        descriptionZh: 'ThemeToggle 的无障碍名称。',
      },
    ]}
  />
)
