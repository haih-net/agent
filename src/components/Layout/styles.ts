import styled from 'styled-components'
// import { TabType } from 'src/TabSwitcher/interfaces'
import { theme } from 'src/theme'

export const LayoutStyled = styled.div`
  display: flex;
  min-height: 100vh;
  background: #ffffff;
`

type LayoutMainProps = {
  $sidebarOpen?: boolean
}

export const LayoutMain = styled.div<LayoutMainProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? '260px' : '48px')};
  transition: margin-left 0.2s ease-in-out;

  @media (max-width: ${theme.breakpoints.md}px) {
    margin-left: 0;
  }
`

export const LayoutTopBar = styled.div`
  display: none;
  align-items: center;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  z-index: 100;
  gap: 12px;

  @media (max-width: ${theme.breakpoints.md}px) {
    display: flex;
  }
`

export const MobileMenuButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition:
    background 0.15s,
    color 0.15s;

  svg {
    width: 20px;
    height: 20px;
  }
`

export const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

type LayoutContentStyledProps = {
  $isHomePage?: boolean
}

export const LayoutContentStyled = styled.div<LayoutContentStyledProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: ${({ $isHomePage }) =>
    $isHomePage ? 'center' : 'flex-start'};
  background: ${({ $isHomePage }) => ($isHomePage ? '#ffffff' : '#ffffff')};
`

export const LayoutInnerContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (max-width: ${theme.breakpoints.md}px) {
    padding: 0 16px;
  }
`

export const LayoutMainContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`
