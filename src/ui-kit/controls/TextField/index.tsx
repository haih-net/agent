import React, { forwardRef } from 'react'
import { TextFieldStyled } from './styles'

export type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    return <TextFieldStyled ref={ref} {...props} />
  },
)

TextField.displayName = 'TextField'
