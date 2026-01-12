import { css, DefaultTheme } from 'styled-components'
import { ComponentSize } from './interfaces'

/**
 * Common size styles for components (Button, Badge, etc.)
 */
export const sizeStyles = (
  theme: DefaultTheme,
): Record<ComponentSize, ReturnType<typeof css>> => ({
  sm: css`
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.fontSizes.xs};
    gap: ${theme.spacing.xs};
  `,
  md: css`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSizes.sm};
    gap: ${theme.spacing.sm};
  `,
  lg: css`
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fontSizes.md};
    gap: ${theme.spacing.sm};
  `,
})

/**
 * Focus ring styles for interactive elements
 */
export const focusRingStyles = css`
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

/**
 * Disabled state styles
 */
export const disabledStyles = css`
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
