import React, { useCallback, useState } from 'react'
import {
  MeUserFragment,
  UserFragment,
  useCreateTransferMutation,
} from 'src/gql/generated'
import {
  SendTransferStyled,
  SendTransferHeaderStyled,
  SendTransferFormStyled,
  SendTransferFieldStyled,
  SendTransferLabelStyled,
  SendTransferInputStyled,
  SendTransferActionsStyled,
  SendTransferErrorStyled,
  SendTransferSuccessStyled,
} from './styles'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'
import { Balance } from '../CurrentUserData/Balance'
import { transactionsRefreshQueriesList } from '../CurrentUserData/Transactions/interfaces'

type SendTransferProps = {
  currentUser: MeUserFragment
  recipient: UserFragment
}

export const SendTransfer: React.FC<SendTransferProps> = ({
  currentUser,
  recipient,
}) => {
  const balance = currentUser.Balance

  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [createTransfer, { loading }] = useCreateTransferMutation()

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)
      setSuccess(null)

      const amountNum = parseFloat(amount)
      if (!amountNum || amountNum <= 0) {
        setError('Введите корректную сумму')
        return
      }

      const currentBalance = currentUser?.Balance?.amount ?? 0
      if (amountNum > currentBalance) {
        setError('Недостаточно средств')
        return
      }

      if (!recipient.id) {
        setError('Неверный получатель')
        return
      }

      const confirm = window.confirm(
        `Отправить перевод на сумму ${amountNum} монет?`,
      )

      if (!confirm) {
        return
      }

      try {
        const result = await createTransfer({
          variables: {
            data: {
              toUserId: recipient.id,
              amount: amountNum,
              title: title || null,
            },
          },
          refetchQueries: transactionsRefreshQueriesList,
        })

        if (result.data?.createTransfer) {
          setSuccess(`Успешно отправлено ${amountNum} Coins!`)
          setAmount('')
          setTitle('')
        }
      } catch (err) {
        setError((err as Error).message || 'Перевод не удался')
      }
    },
    [amount, title, recipient.id, currentUser?.Balance?.amount, createTransfer],
  )

  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(e.target.value)
      setError(null)
      setSuccess(null)
    },
    [],
  )

  const onChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value)
    },
    [],
  )

  const recipientName =
    recipient.fullname || recipient.username || 'Пользователь'

  return process.env.NEXT_PUBLIC_CRYPTO_ENABLED === 'true' && balance ? (
    <SendTransferStyled>
      <Balance currentUser={currentUser} />

      <SendTransferHeaderStyled>
        Отправить перевод пользователю
      </SendTransferHeaderStyled>

      <SendTransferFormStyled onSubmit={handleSubmit}>
        <SendTransferFieldStyled>
          <SendTransferLabelStyled>Кому</SendTransferLabelStyled>
          <SendTransferInputStyled type="text" value={recipientName} disabled />
        </SendTransferFieldStyled>

        <SendTransferFieldStyled>
          <SendTransferLabelStyled>Сумма (Coins)</SendTransferLabelStyled>
          <SendTransferInputStyled
            type="number"
            placeholder="0"
            value={amount}
            onChange={onChangeAmount}
            disabled={loading}
            min="0"
            step="0.01"
          />
        </SendTransferFieldStyled>

        <SendTransferFieldStyled>
          <SendTransferLabelStyled>
            Комментарий (необязательно)
          </SendTransferLabelStyled>
          <SendTransferInputStyled
            type="text"
            placeholder="Для чего этот перевод?"
            value={title}
            onChange={onChangeTitle}
            disabled={loading}
          />
        </SendTransferFieldStyled>

        {error && <SendTransferErrorStyled>{error}</SendTransferErrorStyled>}
        {success && (
          <SendTransferSuccessStyled>{success}</SendTransferSuccessStyled>
        )}

        <SendTransferActionsStyled>
          <Button
            type="submit"
            disabled={loading || !amount}
            variant={ComponentVariant.PRIMARY}
          >
            {loading ? 'Отправка...' : 'Отправить'}
          </Button>
        </SendTransferActionsStyled>
      </SendTransferFormStyled>
    </SendTransferStyled>
  ) : null
}
