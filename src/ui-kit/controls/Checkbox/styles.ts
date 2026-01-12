import styled from 'styled-components'
import { focusRingStyles } from '../styles'

export const CheckboxWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  user-select: none;
`

export const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};

  ${focusRingStyles}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

export const CheckboxLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`
