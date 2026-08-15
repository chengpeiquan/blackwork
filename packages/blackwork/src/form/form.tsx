'use client'

import { createFormHook } from '@tanstack/react-form'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { fieldContext, formContext, useFormContext } from './context'
import { CheckboxField, TextareaField, TextField } from './fields'

export interface FormProps extends React.ComponentProps<'form'> {
  form: {
    handleSubmit: () => unknown
  }
}

export const Form = ({ form, onSubmit, ...props }: FormProps) => (
  <form
    {...props}
    onSubmit={(event) => {
      event.preventDefault()
      onSubmit?.(event)
      void form.handleSubmit()
    }}
  />
)

const SubmitButton = ({
  children = 'Submit',
  ...props
}: React.ComponentProps<typeof Button>) => {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" loading={isSubmitting} {...props}>
          {children}
        </Button>
      )}
    </form.Subscribe>
  )
}

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    CheckboxField,
  },
  formComponents: {
    SubmitButton,
  },
})
