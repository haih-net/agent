import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { ChatMessage, CHAT_SESSION_STORAGE_KEY } from '../interfaces'
import { useSnackbar } from 'src/ui-kit/Snackbar/context'
import { sendMessageStream } from '../../lib/streamClient'

type ChatContextValue = {
  messages: ChatMessage[]
  isLoading: boolean
  showTypingIndicator: boolean
  isOpen: boolean
  isExpanded: boolean
  setIsOpen: (open: boolean) => void
  setIsExpanded: (expanded: boolean) => void
  submitMessage: (text: string) => Promise<void>
  stopStreaming: () => void
  handleClose: () => void
  handleExpand: () => void
  handleToggle: (event: React.MouseEvent) => void
  welcomeTitle: string
  welcomeText: string
  placeholder: string
}

const ChatContext = createContext<ChatContextValue | null>(null)

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider')
  }
  return context
}

type ChatProviderProps = {
  children: React.ReactNode
  welcomeTitle?: string
  welcomeText?: string
  placeholder?: string
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  welcomeTitle = 'Hi! How can I help?',
  welcomeText = 'Ask me anything',
  placeholder = 'Type your message...',
}) => {
  const snackbar = useSnackbar()
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showTypingIndicator, setShowTypingIndicator] = useState(false)
  const sessionIdRef = useRef<string | null>(null)

  const getSessionId = useCallback(() => {
    if (sessionIdRef.current) {
      return sessionIdRef.current
    }
    const stored = localStorage.getItem(CHAT_SESSION_STORAGE_KEY)
    if (stored) {
      sessionIdRef.current = stored
      return stored
    }
    const newId = `chat_${Date.now()}_${Math.random().toString(36).slice(2)}`
    localStorage.setItem(CHAT_SESSION_STORAGE_KEY, newId)
    sessionIdRef.current = newId
    return newId
  }, [])
  const streamingMessageIdRef = useRef<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const TYPING_INDICATOR_DELAY = 400

  const startTypingTimer = useCallback(() => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
    }
    typingTimerRef.current = setTimeout(() => {
      setShowTypingIndicator(true)
    }, TYPING_INDICATOR_DELAY)
  }, [])

  const resetTypingTimer = useCallback(() => {
    setShowTypingIndicator(false)
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
    }
    typingTimerRef.current = setTimeout(() => {
      setShowTypingIndicator(true)
    }, TYPING_INDICATOR_DELAY)
  }, [])

  const clearTypingTimer = useCallback(() => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
      typingTimerRef.current = null
    }
    setShowTypingIndicator(false)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setIsExpanded(false)
  }, [])

  const handleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  const handleToggle = useCallback((event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    setIsOpen((prev) => !prev)
  }, [])

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      streamingMessageIdRef.current = null
      setIsLoading(false)
      clearTypingTimer()
    }
  }, [clearTypingTimer])

  const submitMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) {
        return
      }

      const messageText = text.trim()

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: messageText,
          isUser: true,
        },
      ])
      setIsLoading(true)
      abortControllerRef.current = new AbortController()
      startTypingTimer()

      try {
        await sendMessageStream(
          messageText,
          getSessionId(),
          {
            onChunk: (chunk) => {
              resetTypingTimer()
              if (!streamingMessageIdRef.current) {
                const botMessageId = Date.now().toString()
                streamingMessageIdRef.current = botMessageId
                setMessages((prev) => [
                  ...prev,
                  {
                    id: botMessageId,
                    text: chunk,
                    isUser: false,
                  },
                ])
              } else {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingMessageIdRef.current
                      ? { ...msg, text: msg.text + chunk }
                      : msg,
                  ),
                )
              }
            },
            onDone: () => {
              streamingMessageIdRef.current = null
              abortControllerRef.current = null
              setIsLoading(false)
              clearTypingTimer()
            },
            onError: (error) => {
              if (error.name !== 'AbortError') {
                snackbar?.addMessage(error.message, { variant: 'error' })
                if (streamingMessageIdRef.current) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === streamingMessageIdRef.current
                        ? {
                            ...msg,
                            text: 'Sorry, something went wrong. Please try again.',
                          }
                        : msg,
                    ),
                  )
                } else {
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      text: 'Sorry, something went wrong. Please try again.',
                      isUser: false,
                    },
                  ])
                }
              }
              streamingMessageIdRef.current = null
              abortControllerRef.current = null
              setIsLoading(false)
              clearTypingTimer()
            },
          },
          abortControllerRef.current.signal,
        )
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        snackbar?.addMessage(errorMessage, { variant: 'error' })
        setIsLoading(false)
        clearTypingTimer()
      }
    },
    [
      isLoading,
      snackbar,
      getSessionId,
      startTypingTimer,
      resetTypingTimer,
      clearTypingTimer,
    ],
  )

  const value = useMemo<ChatContextValue>(
    () => ({
      messages,
      isLoading,
      showTypingIndicator,
      isOpen,
      isExpanded,
      setIsOpen,
      setIsExpanded,
      submitMessage,
      stopStreaming,
      handleClose,
      handleExpand,
      handleToggle,
      welcomeTitle,
      welcomeText,
      placeholder,
    }),
    [
      messages,
      isLoading,
      showTypingIndicator,
      isOpen,
      isExpanded,
      submitMessage,
      stopStreaming,
      handleClose,
      handleExpand,
      handleToggle,
      welcomeTitle,
      welcomeText,
      placeholder,
    ],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
