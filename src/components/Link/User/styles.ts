import Link from 'next/link'
import styled from 'styled-components'
import { theme } from 'src/theme'

type SizeProps = {
  $size?: 'small' | 'normal' | 'big'
}

export const UserLinkContainer = styled.div`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  max-width: 100%;
  min-width: 0;
  gap: 5px;
`

export const AvatarLink = styled(Link)`
  display: inline-flex;
  flex-shrink: 0;
`

export const UserAvatar = styled.div<SizeProps>`
  width: ${({ $size }) =>
    $size === 'small' ? '24px' : $size === 'big' ? '48px' : '32px'};
  height: ${({ $size }) =>
    $size === 'small' ? '24px' : $size === 'big' ? '48px' : '32px'};
  border-radius: 50%;
  background: ${theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 60%;
    height: 60%;
    stroke: ${theme.colors.gray[500]};
  }
`

export const NameContainer = styled.div`
  text-align: left;
  flex: 1;
  min-width: 0;
  overflow: hidden;
`

export const NameLink = styled(Link)<SizeProps>`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const UserLinkStyled = styled(Link)``

export const UserNameStyled = styled.span`
  font-weight: 500;
`
