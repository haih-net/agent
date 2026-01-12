import React, { useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  ChatWindow,
  ChatHeader,
  ChatTitle,
  HeaderButtons,
  ExpandButton,
  CloseButton,
} from '../styles'

export type ChatModalProps = {
  children: React.ReactNode
  isExpanded: boolean
  onClose: () => void
  onExpand: () => void
}

export const ChatModal: React.FC<ChatModalProps> = ({
  children,
  isExpanded,
  onClose,
  onExpand,
}) => {
  const stopPropagation = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation()
  }, [])

  const modalContent = (
    <ChatWindow
      $isExpanded={isExpanded}
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onWheel={stopPropagation}
      onTouchStart={stopPropagation}
      onTouchMove={stopPropagation}
    >
      <ChatHeader>
        <ChatTitle>AI Assistant</ChatTitle>
        <HeaderButtons>
          <ExpandButton onClick={onExpand}>
            {isExpanded ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </ExpandButton>
          <CloseButton onClick={onClose}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </CloseButton>
        </HeaderButtons>
      </ChatHeader>

      {children}
    </ChatWindow>
  )

  return createPortal(modalContent, global.document.body)
}
