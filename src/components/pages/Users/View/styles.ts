import styled from 'styled-components'

export const UsersViewStyled = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`

export const UsersViewGridStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const UsersViewCardStyled = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
`
