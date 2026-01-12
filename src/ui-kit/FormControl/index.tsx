import React from 'react'
import {
  FormControlStyled,
  FormControlLabel,
  FormControlHelperText,
  FormControlToolbar,
  FormControlContent,
} from './styles'

export interface FormControlProps {
  children: React.ReactNode
  label?: React.ReactNode
  helperText?: React.ReactNode
  required?: boolean
  error?: boolean
  disabled?: boolean
  toolbarAfter?: React.ReactNode
}

export const FormControl: React.FC<FormControlProps> = ({
  children,
  label,
  helperText,
  required,
  error,
  disabled,
  toolbarAfter,
}) => {
  return (
    <FormControlStyled $error={error} $disabled={disabled}>
      <FormControlToolbar>
        {label && (
          <FormControlLabel>
            {label}
            {required && <span style={{ color: 'red', marginLeft: 2 }}>*</span>}
          </FormControlLabel>
        )}
        {toolbarAfter}
      </FormControlToolbar>

      <FormControlContent>{children}</FormControlContent>

      {helperText && (
        <FormControlHelperText>{helperText}</FormControlHelperText>
      )}
    </FormControlStyled>
  )
}
