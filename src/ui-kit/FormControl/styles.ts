import styled, { css } from 'styled-components'
import { TextareaStyled } from '../controls/Textarea/styles'
import { SelectStyled } from '../controls/Select/styles'
import { DatePickerInput } from '../controls/DatePicker/styles'
import { TextFieldStyled } from '../controls/TextField/styles'

export const FormControlLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`

export const FormControlHelperText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`

export const FormControlToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  &:empty {
    display: none;
  }
`

export const FormControlContent = styled.div`
  display: contents;
`

interface FormControlStyledProps {
  $error?: boolean
  $disabled?: boolean
}

export const FormControlStyled = styled.div<FormControlStyledProps>`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.6;
      pointer-events: none;
    `}

  ${({ $error, theme }) =>
    $error &&
    css`
      ${TextFieldStyled}, ${TextareaStyled}, ${SelectStyled}, ${DatePickerInput} {
        border-color: ${theme.colors.error};
      }

      ${FormControlHelperText} {
        color: ${theme.colors.error};
      }
    `}
`
