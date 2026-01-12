import styled from 'styled-components'

export const MindLogsViewStyled = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`

export const MindLogsViewListStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`
