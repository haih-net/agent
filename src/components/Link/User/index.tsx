import { LinkProps } from 'next/link'
import React from 'react'
import { UserNoNestingFragment } from 'src/gql/generated'
import { UserLinkStyled, UserNameStyled } from './styles'

type UserLike = {
  id?: UserNoNestingFragment['id']
  username?: UserNoNestingFragment['username']
  fullname?: UserNoNestingFragment['fullname']
}

export function createUserLink(user: UserLike): string {
  const { id } = user

  if (!id) {
    console.error(`Can not get user ID`, user)
    return '#'
  }

  return `/users/${id}`
}

type UserLinkProps = React.PropsWithChildren<
  Omit<LinkProps, 'href'> & {
    user: UserLike
  }
>

export const UserLink: React.FC<UserLinkProps> = ({
  user,
  children,
  ...other
}) => {
  const { id, fullname, username } = user

  const displayName = fullname || username || 'Unnamed User'

  if (!id) {
    return children || <UserNameStyled>{displayName}</UserNameStyled>
  }

  const href = createUserLink(user)
  const inner = children || <UserNameStyled>{displayName}</UserNameStyled>

  return (
    <UserLinkStyled key={id} {...other} title={displayName} href={href}>
      {inner}
    </UserLinkStyled>
  )
}
