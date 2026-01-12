import React, { useRef, useEffect, useCallback } from 'react'
import {
  ChatContentContainer,
  ChatMessages,
  ChatInputContainer,
  WelcomeMessage,
  TypingIndicator,
} from '../styles'
import { ChatInputForm } from '../ChatInputForm'
import { useChatContext } from '../context'
import { ChatMessageMemo } from '../ChatMessage'

export const ChatContent: React.FC = () => {
  const { messages, welcomeTitle, welcomeText, showTypingIndicator } =
    useChatContext()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, showTypingIndicator, scrollToBottom])

  const hasMessages = messages.length > 0

  return (
    <ChatContentContainer $hasMessages={hasMessages}>
      {hasMessages ? (
        <ChatMessages>
          {messages.map((msg) => (
            <ChatMessageMemo
              key={msg.id}
              id={msg.id}
              isUser={msg.isUser}
              text={msg.text}
            />
          ))}
          {showTypingIndicator && (
            <TypingIndicator>
              <span />
              <span />
              <span />
            </TypingIndicator>
          )}
          <div ref={messagesEndRef} />
        </ChatMessages>
      ) : (
        <WelcomeMessage>
          <h4>{welcomeTitle}</h4>
          <p>{welcomeText}</p>
        </WelcomeMessage>
      )}

      <ChatInputContainer>
        <ChatInputForm />
      </ChatInputContainer>
    </ChatContentContainer>
  )
}
