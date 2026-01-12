import React from 'react'
import { UserFragment } from 'src/gql/generated'
import Link from 'next/link'
import {
  UsersViewStyled,
  UsersViewGridStyled,
  UsersViewCardStyled,
} from './styles'

type UsersViewProps = {
  users: UserFragment[]
  loading?: boolean
}

export const UsersView: React.FC<UsersViewProps> = ({ users, loading }) => {
  return (
    <UsersViewStyled>
      <h1>Users</h1>

      {loading && users.length === 0 ? (
        <p>Loading...</p>
      ) : users.length > 0 ? (
        <UsersViewGridStyled>
          {users.map((user) => (
            <UsersViewCardStyled key={user.id}>
              <Link href={`/users/${user.id}`}>
                {user.fullname || user.username || 'Anonymous'}
              </Link>
            </UsersViewCardStyled>
          ))}
        </UsersViewGridStyled>
      ) : (
        <p>No users found</p>
      )}
    </UsersViewStyled>
  )
}
