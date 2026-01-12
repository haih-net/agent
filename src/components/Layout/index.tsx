import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  LayoutContentStyled,
  LayoutStyled,
  LayoutMain,
  LayoutTopBar,
  MobileMenuButton,
  LayoutInnerContainer,
} from './styles'
import { SidebarMemo } from './Sidebar'
import { useChatContext } from 'src/components/Chat/ChatWidget/context'
import { ChatContent } from 'src/components/Chat/ChatWidget/ChatContent'
import {
  ChatWidgetContainer,
  ChatButton,
} from 'src/components/Chat/ChatWidget/styles'
import dynamic from 'next/dynamic'

const ChatModal = dynamic(
  () =>
    import('src/components/Chat/ChatWidget/ChatModal').then((r) => r.ChatModal),
  {
    ssr: false,
  },
)

type LayoutProps = React.PropsWithChildren

export const Layout: React.FC<LayoutProps> = ({ children, ...other }) => {
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const chat = useChatContext()

  const chatContent = <ChatContent />

  const chatWidget = (
    <ChatWidgetContainer>
      {chat.isOpen && (
        <ChatModal
          isExpanded={chat.isExpanded}
          onClose={chat.handleClose}
          onExpand={chat.handleExpand}
        >
          {chatContent}
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

  return (
    <LayoutStyled {...other}>
      <SidebarMemo isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <LayoutMain $sidebarOpen={sidebarOpen}>
        <LayoutTopBar>
          <MobileMenuButton onClick={toggleSidebar}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </MobileMenuButton>
        </LayoutTopBar>

        <LayoutContentStyled $isHomePage={isHomePage}>
          <LayoutInnerContainer>
            {children}
            {isHomePage && chatContent}
          </LayoutInnerContainer>
        </LayoutContentStyled>
      </LayoutMain>

      {!isHomePage && chatWidget}
    </LayoutStyled>
  )
}
