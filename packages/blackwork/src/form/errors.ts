export interface FieldMetaLike {
  isTouched: boolean
  isValid: boolean
}

export const getFieldInvalid = (field: { state: { meta: FieldMetaLike } }) =>
  field.state.meta.isTouched && !field.state.meta.isValid

export const toFieldErrors = (errors: unknown[]): Array<{ message?: string }> =>
  errors.flatMap((error) => {
    if (typeof error === 'string') {
      return [{ message: error }]
    }

    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as { message: unknown }).message
      return [
        {
          message:
            message === null || message === undefined
              ? undefined
              : String(message),
        },
      ]
    }

    if (error === null || error === undefined) {
      return []
    }

    return [{ message: String(error) }]
  })
