'use client'

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from 'blackwork'
import { Example } from '../components/example'
import { PropsTable } from '../components/props-table'

const basicCode = `import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
} from 'blackwork'

export const Example = () => {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" placeholder="you@example.com" />
        <FieldDescription>Used for sign-in and notices.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}`

const horizontalCode = `import { Field, FieldLabel, Input } from 'blackwork'

export const Example = () => {
  return (
    <Field orientation="horizontal">
      <FieldLabel htmlFor="name">Name</FieldLabel>
      <Input id="name" />
    </Field>
  )
}`

const invalidCode = `import { Field, FieldDescription, FieldError, FieldLabel, Input } from 'blackwork'

export const Example = () => {
  return (
    <Field data-invalid>
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <Input id="username" aria-invalid defaultValue="ab" />
      <FieldDescription>At least 3 characters.</FieldDescription>
      <FieldError errors={[{ message: 'Username is too short.' }]} />
    </Field>
  )
}`

export const FieldBasicExample = () => (
  <Example className="w-full max-w-md flex-col items-stretch" code={basicCode}>
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="docs-email">Email</FieldLabel>
        <Input id="docs-email" type="email" placeholder="you@example.com" />
        <FieldDescription>Used for sign-in and notices.</FieldDescription>
      </Field>
    </FieldGroup>
  </Example>
)

export const FieldHorizontalExample = () => (
  <Example
    className="w-full max-w-md flex-col items-stretch"
    title="Horizontal"
    titleZh="水平布局"
    code={horizontalCode}
  >
    <Field orientation="horizontal">
      <FieldLabel htmlFor="docs-name">Name</FieldLabel>
      <Input id="docs-name" />
    </Field>
  </Example>
)

export const FieldInvalidExample = () => (
  <Example
    className="w-full max-w-md flex-col items-stretch"
    title="Validation"
    titleZh="校验"
    code={invalidCode}
  >
    <Field data-invalid>
      <FieldLabel htmlFor="docs-username">Username</FieldLabel>
      <Input id="docs-username" aria-invalid defaultValue="ab" />
      <FieldDescription>At least 3 characters.</FieldDescription>
      <FieldError errors={[{ message: 'Username is too short.' }]} />
    </Field>
  </Example>
)

export const FieldPropsTable = () => (
  <PropsTable
    rows={[
      {
        name: 'orientation',
        type: '"vertical" | "horizontal" | "responsive"',
        defaultValue: '"vertical"',
        description: 'Layout of the label and control. Set on Field.',
        descriptionZh: '标签和控件的布局方式，设置在 Field 上。',
      },
      {
        name: 'htmlFor',
        type: 'string',
        description: 'Associates FieldLabel with the control id.',
        descriptionZh: '将 FieldLabel 与控件 id 关联。',
      },
      {
        name: 'data-invalid',
        type: 'boolean',
        description:
          'Marks the Field as invalid. Pair with aria-invalid on the control.',
        descriptionZh: '标记 Field 为无效状态，同时在控件上设置 aria-invalid。',
      },
    ]}
  />
)
