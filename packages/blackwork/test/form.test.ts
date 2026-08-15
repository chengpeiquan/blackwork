import { describe, expect, it } from 'vitest'

import { getFieldInvalid, toFieldErrors } from '../src/form/errors'

describe('getFieldInvalid', () => {
  it('is invalid only after the field is touched', () => {
    expect(
      getFieldInvalid({
        state: { meta: { isTouched: false, isValid: false } },
      }),
    ).toBe(false)
    expect(
      getFieldInvalid({
        state: { meta: { isTouched: true, isValid: true } },
      }),
    ).toBe(false)
    expect(
      getFieldInvalid({
        state: { meta: { isTouched: true, isValid: false } },
      }),
    ).toBe(true)
  })
})

describe('toFieldErrors', () => {
  it('normalizes strings, message objects, and empty values', () => {
    expect(toFieldErrors(['Required', { message: 'Too short' }, null])).toEqual(
      [{ message: 'Required' }, { message: 'Too short' }],
    )
  })
})
