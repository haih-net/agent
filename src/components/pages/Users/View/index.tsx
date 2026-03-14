import React from 'react'
import { UserFragment } from 'src/gql/generated'
import Link from 'next/link'
import {
  UsersViewStyled,
  UsersViewGridStyled,
  UsersViewCardStyled,
} from './styles'
import { SeparatorStyled } from 'src/components/Separator/styles'
import { StatusToggler } from '../User/View/StatusToggler'
import { FormattedDate } from 'src/ui-kit/format/FormattedDate'
import { Pagination } from 'src/components/Pagination'

type UsersViewProps = {
  users: UserFragment[]
  count: number
  page: number
}

export const UsersView: React.FC<UsersViewProps> = ({ users, count, page }) => {
  const totalPages = count ? Math.floor(count / 10) + 1 : 0

  return (
    <UsersViewStyled>
      <h1>Users</h1>

      <UsersViewGridStyled>
        {users.map((user) => (
          <UsersViewCardStyled key={user.id}>
            <Link href={`/users/${user.id}`}>
              {user.fullname || user.username || 'Anonymous'}
            </Link>

            <SeparatorStyled />

            <FormattedDate value={user.createdAt} />
            <StatusToggler user={user} />
          </UsersViewCardStyled>
        ))}
      </UsersViewGridStyled>

      <Pagination currentPage={page} totalPages={totalPages} />
    </UsersViewStyled>
  )
}
