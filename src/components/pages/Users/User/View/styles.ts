import styled from 'styled-components'

export const UserPageActionsStyled = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`

export const UserPageViewToolbarStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const UserPageViewStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`
