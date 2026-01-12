import React from 'react'
import { useSnackbar } from './context'
import { SnackbarContainerStyled } from './styles'
import { SnackbarItem } from './SnackbarItem'

export const Snackbar: React.FC = () => {
  const { messages } = useSnackbar() || {}

  if (!messages?.length) {
    return null
  }

  return (
    <SnackbarContainerStyled>
      {messages.map((message) => (
        <SnackbarItem key={message.id} message={message} />
      ))}
    </SnackbarContainerStyled>
  )
}

export { SnackbarProvider, useSnackbar } from './context'
export type { SnackbarMessage, SnackbarVariant } from './context'
