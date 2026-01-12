import React from 'react'
import { MessageStyled } from '../styles'
import { Markdown } from 'src/components/Markdown'

interface ChatMessageProps {
  id: string
  isUser: boolean
  text?: string
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  isUser,
  text,
}) => {
  return (
    <MessageStyled key={id} $isUser={isUser}>
      {text ? <Markdown>{text}</Markdown> : null}
    </MessageStyled>
  )
}

export const ChatMessageMemo = React.memo(ChatMessage)
