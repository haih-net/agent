import styled, { css, keyframes } from 'styled-components'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

export const ChatWidgetContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
`

type ChatContentContainerProps = {
  $hasMessages?: boolean
}

export const ChatContentContainer = styled.div<ChatContentContainerProps>`
  display: grid;
  flex: 1;
  min-height: 0;
  overflow: auto;
  width: 100%;
  max-width: 100%;

  ${({ $hasMessages }) =>
    $hasMessages
      ? css`
          grid-template-rows: 1fr auto;
          align-content: start;
        `
      : css`
          grid-template-rows: 1fr auto 1fr;
        `}

  @media (max-width: 768px) {
    grid-template-rows: ${({ $hasMessages }) =>
      $hasMessages ? '1fr auto' : '1fr auto auto'};
  }
`

export const ChatWindow = styled.div<{ $isExpanded?: boolean }>`
  position: fixed;
  z-index: 1000;
  bottom: 20px;
  right: 20px;
  width: ${({ $isExpanded }) => ($isExpanded ? '100vw' : '380px')};
  height: ${({ $isExpanded }) =>
    $isExpanded ? '100%' : 'min(500px, calc(100vh - 80px))'};
  max-height: calc(100vh - 80px);
  background: #ffffff;
  border-radius: ${({ $isExpanded }) => ($isExpanded ? '0' : '16px')};
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${fadeIn} 0.2s ease-out;

  ${({ $isExpanded }) =>
    $isExpanded &&
    css`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      max-height: 100%;
    `}

  @media (max-width: 480px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
`

export const ChatHeader = styled.div`
  padding: 16px 20px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
`

export const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
`

export const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const HeaderButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: color 0.2s;

  &:hover {
    color: #1f2937;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

export const ExpandButton = styled(HeaderButton)`
  @media (max-width: 480px) {
    display: none;
  }
`

export const CloseButton = styled(HeaderButton)``

export const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`

export const MessageStyled = styled.div<{ $isUser?: boolean }>`
  max-width: 85%;
  padding: 14px 18px;
  border-radius: 20px;
  font-size: 0.9375rem;
  line-height: 1.6;
  align-self: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  background: ${({ $isUser }) => ($isUser ? '#3b82f6' : '#ffffff')};
  color: ${({ $isUser }) => ($isUser ? '#fff' : '#1f2937')};
  border-bottom-right-radius: ${({ $isUser }) => ($isUser ? '6px' : '20px')};
  border-bottom-left-radius: ${({ $isUser }) => ($isUser ? '20px' : '6px')};
  box-shadow: ${({ $isUser }) =>
    $isUser
      ? '0 2px 8px rgba(59, 130, 246, 0.25)'
      : '0 1px 3px rgba(0, 0, 0, 0.08)'};
`

export const ChatInputContainer = styled.div`
  padding: 16px 24px 24px;
  background: transparent;
  grid-row: 2;
`

export const ChatForm = styled.form`
  display: flex;
  gap: 12px;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 24px;
  padding: 8px 8px 8px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
`

export const ChatTextarea = styled.textarea`
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 0;
  background: transparent;
  color: #1f2937;
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  resize: none;
  min-height: 24px;
  max-height: 200px;
  line-height: 1.5;

  &::placeholder {
    color: #9ca3af;
  }
`

type SendButtonProps = {
  $hasText?: boolean
}

export const SendButton = styled.button<SendButtonProps>`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ $hasText }) => ($hasText ? '#1f2937' : '#9ca3af')};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 0;

  &:hover {
    background: ${({ $hasText }) => ($hasText ? '#374151' : '#6b7280')};
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
    fill: #fff;
    margin-left: 2px;
  }
`

export const StopButton = styled.button`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #1f2937;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 0;

  &:hover {
    background: #374151;
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
    fill: #fff;
  }
`

export const TypingIndicator = styled.div`
  display: flex;
  gap: 5px;
  padding: 14px 18px;
  align-self: flex-start;
  background: #ffffff;
  border-radius: 20px;
  border-bottom-left-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  span {
    width: 8px;
    height: 8px;
    background: #9ca3af;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`

export const WelcomeMessage = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  grid-row: 1;

  h4 {
    color: #1f2937;
    margin: 0 0 12px;
    font-size: 1.75rem;
    font-weight: 600;
  }

  p {
    max-width: 400px;
  }
`

export const ChatButton = styled.button<{ $isOpen?: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #3b82f6;
  border: none;
  cursor: pointer;
  display: ${({ $isOpen }) => ($isOpen ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
  }

  svg {
    width: 24px;
    height: 24px;
    fill: #fff;
    display: block;
  }
`
