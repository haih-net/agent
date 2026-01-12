import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { v4 as uuid } from 'uuid'

export type SnackbarVariant = 'success' | 'error' | 'info' | 'warning'

export interface SnackbarMessage {
  id: string
  message: string
  variant?: SnackbarVariant
  autoHideDuration?: number
}

export interface SnackbarContextValue {
  messages: SnackbarMessage[]
  addMessage: (
    message: string,
    options?: {
      variant?: SnackbarVariant
      autoHideDuration?: number
    },
  ) => string
  removeMessage: (id: string) => void
  clearMessages: () => void
}

export const SnackbarContext = createContext<SnackbarContextValue | null>(null)

export function useSnackbar() {
  return useContext(SnackbarContext)
}

export const SnackbarProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [messages, setMessages] = useState<SnackbarMessage[]>([])

  const addMessage = useCallback(
    (
      message: string,
      options?: {
        variant?: SnackbarVariant
        autoHideDuration?: number
      },
    ) => {
      const id = uuid()

      const newMessage: SnackbarMessage = {
        id,
        message,
        variant: options?.variant || 'info',
        autoHideDuration: options?.autoHideDuration || 5000,
      }

      setMessages((prev) => [...prev, newMessage])
      return id
    },
    [],
  )

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id))
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const value = useMemo<SnackbarContextValue>(() => {
    return {
      messages,
      addMessage,
      removeMessage,
      clearMessages,
    }
  }, [addMessage, clearMessages, messages, removeMessage])

  return (
    <SnackbarContext.Provider value={value}>
      {children}
    </SnackbarContext.Provider>
  )
}
