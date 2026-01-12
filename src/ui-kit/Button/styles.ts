import styled, { css, DefaultTheme } from 'styled-components'
import { ComponentSize, ComponentVariant } from '../interfaces'
import { sizeStyles } from '../styles'

export type ButtonVariant = ComponentVariant
export type ButtonSize = ComponentSize

interface ButtonStyledProps {
  $variant: ButtonVariant
  $size: ButtonSize
}

const variantStyles = (
  theme: DefaultTheme,
): Record<ComponentVariant, ReturnType<typeof css>> => ({
  default: css`
    background: ${theme.backgrounds.paper};
    color: ${theme.colors.text.primary};
    border: 1px solid ${theme.colors.border};

    &:hover:not(:disabled) {
      border-color: ${theme.colors.borderHover};
    }
  `,
  primary: css`
    background: ${theme.colors.primary};
    color: ${theme.colors.text.light};
    border: 1px solid ${theme.colors.primary};

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
  secondary: css`
    background: #78909c;
    color: ${theme.colors.text.light};
    border: 1px solid #78909c;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
  success: css`
    background: ${theme.colors.success};
    color: ${theme.colors.text.light};
    border: 1px solid ${theme.colors.success};

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
  warning: css`
    background: ${theme.colors.warning};
    color: ${theme.colors.text.light};
    border: 1px solid ${theme.colors.warning};

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
  danger: css`
    background: ${theme.colors.error};
    color: ${theme.colors.text.light};
    border: 1px solid ${theme.colors.error};

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
})

export const buttonBaseStyles = css<ButtonStyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $variant, theme }) => variantStyles(theme)[$variant]}
  ${({ $size, theme }) => sizeStyles(theme)[$size]}
`

export const ButtonStyled = styled.button<ButtonStyledProps>`
  ${buttonBaseStyles}
`
