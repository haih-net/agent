import React from 'react'
import { CheckboxWrapper, CheckboxInput, CheckboxLabel } from './styles'

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label: string
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <CheckboxWrapper>
      <CheckboxInput type="checkbox" {...props} />
      <CheckboxLabel>{label}</CheckboxLabel>
    </CheckboxWrapper>
  )
}
