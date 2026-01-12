import styled from 'styled-components'

export const RatingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const RatingLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`

export const RatingStars = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
`

interface StarProps {
  $filled: boolean
  $interactive: boolean
}

export const Star = styled.button<StarProps>`
  background: none;
  border: none;
  padding: 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ $filled, theme }) =>
    $filled ? theme.colors.star : theme.colors.starEmpty};
  cursor: ${({ $interactive }) => ($interactive ? 'pointer' : 'default')};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ $interactive, theme }) =>
      $interactive ? theme.colors.star : undefined};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

export const RatingValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-left: ${({ theme }) => theme.spacing.sm};
`
