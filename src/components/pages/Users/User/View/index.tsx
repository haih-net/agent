import { UserFragment } from 'src/gql/generated'
import { UserPageViewStyled, UserPageActionsStyled } from './styles'
import { UserEditForm } from './Form'
import { useCallback, useState } from 'react'
import { Button } from 'src/ui-kit/Button'
import { SignOutButton } from 'src/components/Auth/SignOutButton'
import { useAppContext } from 'src/components/AppContext'
import { Markdown } from 'src/components/Markdown'

type UserPageViewProps = {
  user: UserFragment
}

export const UserPageView: React.FC<UserPageViewProps> = ({
  user,
  ...other
}) => {
  const { user: currentUser } = useAppContext()
  const [isEditing, setIsEditing] = useState(false)

  const isCurrentUser = currentUser?.id === user.id

  const handleEditClick = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsEditing(false)
  }, [])

  return (
    <UserPageViewStyled {...other}>
      {user.fullname && <h1>{user.fullname}</h1>}

      <Markdown>{user.content}</Markdown>

      {isEditing ? (
        <UserEditForm user={user} closeForm={handleCloseForm} />
      ) : null}

      {isCurrentUser && (
        <UserPageActionsStyled>
          <Button onClick={handleEditClick}>Edit</Button>

          <SignOutButton />
        </UserPageActionsStyled>
      )}
    </UserPageViewStyled>
  )
}
