'use client'

import { Field, FieldLabel, Input } from 'blackwork'
import { FieldGroup, Form, useAppForm } from 'blackwork/form'
import { Example } from '../components/example'
import { PropsTable } from '../components/props-table'

const basicCode = `'use client'

import { FieldGroup, Form, useAppForm } from 'blackwork/form'

export const Example = () => {
  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <Form form={form} className="flex w-full max-w-md flex-col gap-4">
      <FieldGroup>
        <form.AppField
          name="email"
          children={(field) => (
            <field.TextField label="Email" type="email" />
          )}
        />
      </FieldGroup>
      <form.AppForm>
        <form.SubmitButton>Save</form.SubmitButton>
      </form.AppForm>
    </Form>
  )
}`

const fieldsCode = `'use client'

import { FieldGroup, Form, useAppForm } from 'blackwork/form'

export const Example = () => {
  const form = useAppForm({
    defaultValues: {
      bio: '',
      subscribe: false,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <Form form={form} className="flex w-full max-w-md flex-col gap-4">
      <FieldGroup>
        <form.AppField
          name="bio"
          children={(field) => (
            <field.TextareaField
              label="Bio"
              description="Optional. Shown on your public profile."
            />
          )}
        />
        <form.AppField
          name="subscribe"
          children={(field) => (
            <field.CheckboxField label="Subscribe to product updates" />
          )}
        />
      </FieldGroup>
      <form.AppForm>
        <form.SubmitButton>Save</form.SubmitButton>
      </form.AppForm>
    </Form>
  )
}`

const customCode = `'use client'

import { Field, FieldLabel, Input } from 'blackwork'
import { FieldGroup, Form, useAppForm } from 'blackwork/form'

export const Example = () => {
  const form = useAppForm({
    defaultValues: { website: '' },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <Form form={form}>
      <FieldGroup>
        <form.AppField
          name="website"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Website</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </Field>
          )}
        />
      </FieldGroup>
    </Form>
  )
}`

export const FormBasicExample = () => {
  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <Example
      className="w-full max-w-md flex-col items-stretch"
      title="Usage"
      code={basicCode}
    >
      <Form form={form} className="flex w-full flex-col gap-4">
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
    </Example>
  )
}

export const FormFieldsExample = () => {
  const form = useAppForm({
    defaultValues: {
      bio: '',
      subscribe: false,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <Example
      className="w-full max-w-md flex-col items-stretch"
      title="Built-in fields"
      code={fieldsCode}
    >
      <Form form={form} className="flex w-full flex-col gap-4">
        <FieldGroup>
          <form.AppField
            name="bio"
            children={(field) => (
              <field.TextareaField
                label="Bio"
                description="Optional. Shown on your public profile."
              />
            )}
          />
          <form.AppField
            name="subscribe"
            children={(field) => (
              <field.CheckboxField label="Subscribe to product updates" />
            )}
          />
        </FieldGroup>
        <form.AppForm>
          <form.SubmitButton>Save</form.SubmitButton>
        </form.AppForm>
      </Form>
    </Example>
  )
}

export const FormCustomExample = () => {
  const form = useAppForm({
    defaultValues: {
      website: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <Example
      className="w-full max-w-md flex-col items-stretch"
      title="Custom field"
      code={customCode}
    >
      <Form form={form} className="flex w-full flex-col gap-4">
        <FieldGroup>
          <form.AppField
            name="website"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Website</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          />
        </FieldGroup>
        <form.AppForm>
          <form.SubmitButton>Save</form.SubmitButton>
        </form.AppForm>
      </Form>
    </Example>
  )
}

export const FormPropsTable = () => (
  <PropsTable
    rows={[
      {
        name: 'form',
        type: '{ handleSubmit: () => unknown }',
        required: true,
        description: 'Form instance from useAppForm. Required on Form.',
      },
      {
        name: 'label',
        type: 'ReactNode',
        required: true,
        description:
          'Visible label on TextField, TextareaField, and CheckboxField.',
      },
      {
        name: 'description',
        type: 'ReactNode',
        description: 'Help text rendered under the control.',
      },
    ]}
  />
)
