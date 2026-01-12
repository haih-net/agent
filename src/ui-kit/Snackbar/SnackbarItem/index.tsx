import { useCallback, useEffect, useState } from 'react'
import { SnackbarMessage, useSnackbar } from '../context'
import {
  SnackbarCloseButtonStyled,
  SnackbarMessageStyled,
  SnackbarMessageTextStyled,
} from '../styles'

interface SnackbarItemProps {
  message: SnackbarMessage
}

export const SnackbarItem: React.FC<SnackbarItemProps> = ({ message }) => {
  const { removeMessage } = useSnackbar() || {}
  const [closing, setClosing] = useState(false)

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      removeMessage?.(message.id)
    }, 300) // Время анимации закрытия
  }, [message.id, removeMessage])

  useEffect(() => {
    if (message.autoHideDuration) {
      const timer = setTimeout(() => {
        handleClose()
      }, message.autoHideDuration)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [message.autoHideDuration, handleClose])

  return (
    <SnackbarMessageStyled
      $variant={message.variant || 'info'}
      $closing={closing}
    >
      <SnackbarMessageTextStyled>{message.message}</SnackbarMessageTextStyled>
      <SnackbarCloseButtonStyled onClick={handleClose}>
        ✕
      </SnackbarCloseButtonStyled>
    </SnackbarMessageStyled>
  )
}
