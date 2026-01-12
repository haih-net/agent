import Link from 'next/link'
import styled from 'styled-components'

export const UserLinkStyled = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const UserNameStyled = styled.span`
  font-weight: 500;
`
