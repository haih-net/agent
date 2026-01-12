import styled from 'styled-components'

export const TasksViewStyled = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`

export const TasksViewGridStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`
