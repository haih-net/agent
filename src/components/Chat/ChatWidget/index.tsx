import React from 'react'
import { ChatWidgetContainer, ChatButton } from './styles'
import { ChatContent } from './ChatContent'
import { useChatContext } from './context'
import dynamic from 'next/dynamic'

const ChatModal = dynamic(
  () => import('./ChatModal').then((r) => r.ChatModal),
  {
    ssr: false,
  },
)

export const ChatWidget: React.FC = () => {
  const chat = useChatContext()

  return (
    <ChatWidgetContainer>
      {chat.isOpen && (
        <ChatModal
          isExpanded={chat.isExpanded}
          onClose={chat.handleClose}
          onExpand={chat.handleExpand}
        >
          <ChatContent />
        </ChatModal>
      )}

      <ChatButton
        onClick={chat.handleToggle}
        $isOpen={chat.isOpen}
        type="button"
      >
        <svg viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </ChatButton>
    </ChatWidgetContainer>
  )
}
