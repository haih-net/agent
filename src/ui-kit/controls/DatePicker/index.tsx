import React, { forwardRef, useCallback } from 'react'
import { DatePickerInput } from './styles'

export interface DatePickerProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  onChange?: (value: string) => void
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value)
      },
      [onChange],
    )

    return (
      <DatePickerInput
        ref={ref}
        type="date"
        onChange={handleChange}
        {...props}
      />
    )
  },
)

DatePicker.displayName = 'DatePicker'
