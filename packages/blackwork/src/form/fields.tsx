'use client'

import * as React from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useFieldContext } from './context'
import { getFieldInvalid, toFieldErrors } from './errors'

const renderFieldError = (
  isInvalid: boolean,
  errors: unknown[],
): React.ReactNode => {
  if (!isInvalid) {
    return null
  }

  return <FieldError errors={toFieldErrors(errors)} />
}

export interface TextFieldProps extends Omit<
  React.ComponentProps<typeof Input>,
  'id' | 'name' | 'value' | 'onBlur' | 'onChange'
> {
  label: React.ReactNode
  description?: React.ReactNode
}

export const TextField = ({ label, description, ...props }: TextFieldProps) => {
  const field = useFieldContext<string>()
  const isInvalid = getFieldInvalid(field)

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => {
          field.handleChange(event.target.value)
        }}
        aria-invalid={isInvalid}
        {...props}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {renderFieldError(isInvalid, field.state.meta.errors)}
    </Field>
  )
}

export interface TextareaFieldProps extends Omit<
  React.ComponentProps<typeof Textarea>,
  'id' | 'name' | 'value' | 'onBlur' | 'onChange'
> {
  label: React.ReactNode
  description?: React.ReactNode
}

export const TextareaField = ({
  label,
  description,
  ...props
}: TextareaFieldProps) => {
  const field = useFieldContext<string>()
  const isInvalid = getFieldInvalid(field)

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => {
          field.handleChange(event.target.value)
        }}
        aria-invalid={isInvalid}
        {...props}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {renderFieldError(isInvalid, field.state.meta.errors)}
    </Field>
  )
}

export interface CheckboxFieldProps extends Omit<
  React.ComponentProps<typeof Checkbox>,
  'id' | 'name' | 'checked' | 'onCheckedChange' | 'onBlur'
> {
  label: React.ReactNode
  description?: React.ReactNode
}

export const CheckboxField = ({
  label,
  description,
  ...props
}: CheckboxFieldProps) => {
  const field = useFieldContext<boolean>()
  const isInvalid = getFieldInvalid(field)

  return (
    <Field orientation="horizontal" data-invalid={isInvalid}>
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onBlur={field.handleBlur}
        onCheckedChange={(checked) => {
          field.handleChange(checked === true)
        }}
        aria-invalid={isInvalid}
        {...props}
      />
      <FieldLabel htmlFor={field.name} className="font-normal">
        {label}
      </FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {renderFieldError(isInvalid, field.state.meta.errors)}
    </Field>
  )
}
