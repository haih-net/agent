import { useCallback } from 'react'
import { useAppContext } from 'src/components/AppContext'
import {
  UserFragment,
  UserStatusEnum,
  useUpdateUserMutation,
} from 'src/gql/generated'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'

type StatusTogglerProps = {
  user: UserFragment
}

export const StatusToggler: React.FC<StatusTogglerProps> = ({ user }) => {
  const { user: currentUser } = useAppContext()

  const { id, status } = user

  const [mutation, { loading }] = useUpdateUserMutation()

  let newStatus: UserStatusEnum

  switch (status) {
    case UserStatusEnum.ACTIVE:
      newStatus = UserStatusEnum.BLOCKED
      break

    default:
      newStatus = UserStatusEnum.ACTIVE
  }

  const onClickToggleStatus = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()

      mutation({
        variables: {
          where: {
            id,
          },
          data: {
            status: newStatus,
          },
        },
      })
    },
    [mutation, newStatus, id],
  )

  return (
    <>
      <Button
        onClick={onClickToggleStatus}
        disabled={loading || !currentUser?.sudo}
        variant={
          status === UserStatusEnum.BLOCKED
            ? ComponentVariant.DANGER
            : status === UserStatusEnum.NEWBIE
              ? ComponentVariant.WARNING
              : ComponentVariant.SUCCESS
        }
      >
        {status}
      </Button>
    </>
  )
}
