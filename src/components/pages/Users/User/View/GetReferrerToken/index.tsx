import React, { useCallback, useState } from 'react'
import {
  GetReferrerTokenRowStyled,
  GetReferrerTokenStyled,
  GetReferrerTokenTextStyled,
} from './styles'
import { Button } from 'src/ui-kit/Button'
import { useCreateReferrerTokenMutation } from 'src/gql/generated'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { useCopy } from 'src/hooks/useCopy'
import { ComponentVariant } from 'src/ui-kit/interfaces'
import { GET_PARAM_REFERRERTOKEN_NAME } from 'src/components/Auth/SignUpForm/interfaces'

export const GetReferrerToken: React.FC = () => {
  const { addMessage } = useSnackbar() || {}

  const [token, tokenSetter] = useState<string>(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbW1vMXB1Zm4wMDAwOGhxdTJlYmUzZW16IiwidHlwZSI6InJlZmVycmVyIiwiaWF0IjoxNzczNDcxNTA5LCJleHAiOjE3NzM0NzUxMDl9.j3JGH9Yjhx_0TaTbr2zjhSd9QX6okHVXPEU3X6RF4-I',
  )

  const [mutation, { loading }] = useCreateReferrerTokenMutation()

  const onClickGetToken = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()

      mutation()
        .then((r) => {
          if (r.data?.createReferrerToken) {
            tokenSetter(r.data?.createReferrerToken)
          } else {
            addMessage?.('Can not get token', {
              variant: 'error',
            })
          }
        })
        .catch((error: Error) => {
          addMessage?.(error.message || 'Unknown error', {
            variant: 'error',
          })
        })
    },
    [addMessage, mutation],
  )

  const { onClickCopy } = useCopy()

  return (
    <GetReferrerTokenStyled>
      <div>
        <Button onClick={onClickGetToken} disabled={loading}>
          Create referrer token
        </Button>
      </div>

      {token && (
        <GetReferrerTokenRowStyled>
          <GetReferrerTokenTextStyled>{token}</GetReferrerTokenTextStyled>
          <Button onClick={onClickCopy} value={token}>
            Скопировать токен
          </Button>
          <Button
            onClick={onClickCopy}
            value={`${global.window.origin}/signup?${GET_PARAM_REFERRERTOKEN_NAME}=${token}`}
            variant={ComponentVariant.SUCCESS}
          >
            Скопировать ссылку
          </Button>
        </GetReferrerTokenRowStyled>
      )}
    </GetReferrerTokenStyled>
  )
}
