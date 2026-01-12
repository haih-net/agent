import React, { forwardRef } from 'react'
import { TextareaStyled } from './styles'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return <TextareaStyled ref={ref} {...props} />
  },
)

Textarea.displayName = 'Textarea'
