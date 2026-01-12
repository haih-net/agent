import styled from 'styled-components'

export const MindLogCardStyled = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  span {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  p {
    margin-top: ${({ theme }) => theme.spacing.sm};
    white-space: pre-wrap;
  }
`
