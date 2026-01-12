import { css } from 'styled-components'

// Re-export common styles for controls
export { focusRingStyles, disabledStyles } from '../styles'

/**
 * Base styles for text-input-like controls (Input, Textarea, Select, DatePicker)
 */
export const controlBaseStyles = css`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-family: inherit;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.backgrounds.paper};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.normal};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    background: ${({ theme }) => theme.backgrounds.page};
    cursor: not-allowed;
    opacity: 0.6;
  }
`
