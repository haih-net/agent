import React, { useCallback } from 'react'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  ChatForm,
  ChatTextarea,
  SendButton,
  StopButton,
  MessageStyled as Message,
  ChatMessages,
  ChatWindow,
  ChatHeader,
  ChatTitle,
  HeaderButtons,
  ExpandButton,
  CloseButton,
  ChatContentContainer,
  ChatInputContainer,
  WelcomeMessage,
} from './styles'
import { Markdown } from 'src/components/Markdown'

const meta: Meta = {
  title: 'Components/ChatWidget',
}

export default meta

const PreventDefault: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
  }, [])
  return <ChatForm onSubmit={handleSubmit}>{children}</ChatForm>
}

export const InputFormDefault: StoryObj = {
  render: () => (
    <div style={{ width: 380, padding: 16, background: '#f5f5f5' }}>
      <PreventDefault>
        <ChatTextarea placeholder="Type your message..." rows={1} />
        <SendButton type="submit" $hasText={false}>
          <svg viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </SendButton>
      </PreventDefault>
    </div>
  ),
}

export const InputFormWithText: StoryObj = {
  render: () => (
    <div style={{ width: 380, padding: 16, background: '#f5f5f5' }}>
      <PreventDefault>
        <ChatTextarea
          placeholder="Type your message..."
          rows={1}
          defaultValue="Hello, how are you?"
        />
        <SendButton type="submit" $hasText={true}>
          <svg viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </SendButton>
      </PreventDefault>
    </div>
  ),
}

export const InputFormDisabled: StoryObj = {
  render: () => (
    <div style={{ width: 380, padding: 16, background: '#f5f5f5' }}>
      <PreventDefault>
        <ChatTextarea placeholder="Type your message..." rows={1} disabled />
        <SendButton type="submit" $hasText={false} disabled>
          <svg viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </SendButton>
      </PreventDefault>
    </div>
  ),
}

export const InputFormStreaming: StoryObj = {
  render: () => (
    <div style={{ width: 380, padding: 16, background: '#f5f5f5' }}>
      <PreventDefault>
        <ChatTextarea placeholder="Type your message..." rows={1} disabled />
        <StopButton type="button">
          <svg viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        </StopButton>
      </PreventDefault>
    </div>
  ),
}

export const MessageUser: StoryObj = {
  render: () => (
    <div style={{ width: 380, padding: 16, background: '#f5f5f5' }}>
      <Message $isUser={true}>
        <Markdown>Hello! How can I learn React?</Markdown>
      </Message>
    </div>
  ),
}

export const MessageBot: StoryObj = {
  render: () => (
    <div style={{ width: 380, padding: 16, background: '#f5f5f5' }}>
      <Message $isUser={false}>
        <Markdown>
          Great question! Here are some steps to learn React: 1. **Learn
          JavaScript basics** - ES6+ features 2. **Understand JSX** - React's
          syntax extension 3. **Components and Props** - Building blocks 4.
          **State and Hooks** - Managing data
        </Markdown>
      </Message>
    </div>
  ),
}

export const MessageBotStreaming: StoryObj = {
  render: () => (
    <div style={{ width: 380, padding: 16, background: '#f5f5f5' }}>
      <Message $isUser={false}>
        <Markdown>
          Great question! Here are some steps to learn React...
        </Markdown>
      </Message>
    </div>
  ),
}

export const MessageBotEmpty: StoryObj = {
  render: () => (
    <div style={{ width: 380, padding: 16, background: '#f5f5f5' }}>
      <Message $isUser={false}>{null}</Message>
    </div>
  ),
}

export const ChatConversation: StoryObj = {
  render: () => (
    <div style={{ width: 380, background: '#f5f5f5' }}>
      <ChatMessages style={{ maxHeight: 400 }}>
        <Message $isUser={true}>
          <Markdown>Hello! How can I learn React?</Markdown>
        </Message>
        <Message $isUser={false}>
          <Markdown>
            Great question! Here are some steps: 1. **Learn JavaScript basics**
            2. **Understand JSX** 3. **Components and Props**
          </Markdown>
        </Message>
        <Message $isUser={true}>
          <Markdown>What about hooks?</Markdown>
        </Message>
        <Message $isUser={false}>
          <Markdown>
            Hooks are functions that let you use state and other React features.
            The most common ones are `useState` and `useEffect`.
          </Markdown>
        </Message>
      </ChatMessages>
    </div>
  ),
}

export const ChatWindowDefault: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', height: 500 }}>
      <ChatWindow
        style={{ position: 'relative', bottom: 'auto', right: 'auto' }}
      >
        <ChatHeader>
          <ChatTitle>Chat Assistant</ChatTitle>
          <HeaderButtons>
            <ExpandButton>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                />
              </svg>
            </ExpandButton>
            <CloseButton>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </CloseButton>
          </HeaderButtons>
        </ChatHeader>
        <ChatContentContainer $hasMessages={false}>
          <WelcomeMessage>
            <h4>Hi! How can I help?</h4>
            <p>Ask me anything</p>
          </WelcomeMessage>
          <ChatInputContainer>
            <PreventDefault>
              <ChatTextarea placeholder="Type your question..." rows={1} />
              <SendButton type="submit" $hasText={false}>
                <svg viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </SendButton>
            </PreventDefault>
          </ChatInputContainer>
        </ChatContentContainer>
      </ChatWindow>
    </div>
  ),
}

export const ChatWindowWithMessages: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', height: 500 }}>
      <ChatWindow
        style={{ position: 'relative', bottom: 'auto', right: 'auto' }}
      >
        <ChatHeader>
          <ChatTitle>Chat Assistant</ChatTitle>
          <HeaderButtons>
            <ExpandButton>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                />
              </svg>
            </ExpandButton>
            <CloseButton>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </CloseButton>
          </HeaderButtons>
        </ChatHeader>
        <ChatContentContainer $hasMessages={true}>
          <ChatMessages>
            <Message $isUser={true}>
              <Markdown>Hello!</Markdown>
            </Message>
            <Message $isUser={false}>
              <Markdown>Hi! How can I help you today?</Markdown>
            </Message>
          </ChatMessages>
          <ChatInputContainer>
            <PreventDefault>
              <ChatTextarea placeholder="Type your question..." rows={1} />
              <SendButton type="submit" $hasText={false}>
                <svg viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </SendButton>
            </PreventDefault>
          </ChatInputContainer>
        </ChatContentContainer>
      </ChatWindow>
    </div>
  ),
}

export const ChatWindowStreaming: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', height: 500 }}>
      <ChatWindow
        style={{ position: 'relative', bottom: 'auto', right: 'auto' }}
      >
        <ChatHeader>
          <ChatTitle>Chat Assistant</ChatTitle>
          <HeaderButtons>
            <ExpandButton>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                />
              </svg>
            </ExpandButton>
            <CloseButton>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </CloseButton>
          </HeaderButtons>
        </ChatHeader>
        <ChatContentContainer $hasMessages={true}>
          <ChatMessages>
            <Message $isUser={true}>
              <Markdown>How do I learn React?</Markdown>
            </Message>
            <Message $isUser={false}>
              <Markdown>
                Great question! Here are some steps to learn React...
              </Markdown>
            </Message>
          </ChatMessages>
          <ChatInputContainer>
            <PreventDefault>
              <ChatTextarea
                placeholder="Type your question..."
                rows={1}
                disabled
              />
              <StopButton type="button">
                <svg viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </StopButton>
            </PreventDefault>
          </ChatInputContainer>
        </ChatContentContainer>
      </ChatWindow>
    </div>
  ),
}
