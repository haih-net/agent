import styled, { css, keyframes } from 'styled-components'
import { SnackbarVariant } from './context'

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`

export const SnackbarContainerStyled = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 400px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

type SnackbarMessageStyledProps = {
  $variant: SnackbarVariant
  $closing?: boolean
}

export const SnackbarMessageStyled = styled.div<SnackbarMessageStyledProps>`
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${slideIn} 0.3s ease-out forwards;
  min-width: 200px;

  ${({ $closing }) =>
    $closing &&
    css`
      animation: ${slideOut} 0.3s ease-in forwards;
    `}

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'success':
        return css`
          background-color: ${theme.colors.success};
          color: ${theme.colors.text.light};
        `
      case 'error':
        return css`
          background-color: ${theme.colors.error};
          color: ${theme.colors.text.light};
        `
      case 'warning':
        return css`
          background-color: ${theme.colors.warning};
          color: ${theme.colors.text.light};
        `
      case 'info':
      default:
        return css`
          background-color: ${theme.colors.info};
          color: ${theme.colors.text.light};
        `
    }
  }}
`

export const SnackbarMessageTextStyled = styled.div`
  flex: 1;
  padding-right: 8px;
  font-size: 0.875rem;
`

export const SnackbarCloseButtonStyled = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: none;
  }
`
