import React, { useEffect, useState } from 'react'

import {
  AuthPayloadFragment,
  useAuthViaTelegramMutation,
} from 'src/gql/generated'
import { useAppContext } from '../AppContext'
import { useSnackbar } from 'src/ui-kit/Snackbar'

type TelegramButtonProps = {
  botName: string
  buttonSize: 'large' | 'medium' | 'small'
  cornerRadius: number
}

export type TelegramAuthFormProps = {
  onAuthSuccessHandler: ((data?: AuthPayloadFragment) => void) | undefined
  buttonSize?: TelegramButtonProps['buttonSize']
}

export const TelegramAuthForm: React.FC<TelegramAuthFormProps> = ({
  onAuthSuccessHandler,
  buttonSize = 'large',
}) => {
  const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME
  const [container, containerSetter] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!container || !botName) {
      return
    }

    const telegramAuthProps: TelegramButtonProps = {
      botName,
      cornerRadius: 5,
      buttonSize,
    }

    // Подключаем скрипт Telegram login
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?7'
    script.async = true
    script.setAttribute('data-telegram-login', telegramAuthProps.botName)
    script.setAttribute('data-size', telegramAuthProps.buttonSize)
    script.setAttribute('data-radius', String(telegramAuthProps.cornerRadius))
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')

    container.appendChild(script)

    // Чистим при размонтировании
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).onTelegramAuth
    }
  }, [container, botName, buttonSize])

  const { addMessage } = useSnackbar() || {}

  const { onAuth: onAuthSuccess } = useAppContext()

  const [authMutation] = useAuthViaTelegramMutation()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function onAuth(authData: any) {
      try {
        await authMutation({
          variables: {
            tgAuthData: authData,
          },
        }).then((r) => {
          if (
            r.data?.authViaTelegram?.success &&
            r.data.authViaTelegram.token
          ) {
            onAuthSuccess?.(r.data.authViaTelegram.token)

            onAuthSuccessHandler?.(r.data.authViaTelegram)
          } else {
            throw new Error(r.data?.authViaTelegram?.message || 'Unknown error')
          }
        })
      } catch (error) {
        addMessage?.((error as Error).message || 'Ошибка выполнения запроса', {
          variant: 'error',
        })
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).onTelegramAuth = onAuth
  }, [addMessage, authMutation, onAuthSuccess, onAuthSuccessHandler])

  return (
    botName && (
      <div
        style={{
          display: 'contents',
        }}
        ref={containerSetter}
      />
    )
  )
}
