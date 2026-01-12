import styled from 'styled-components'
import Link from 'next/link'
import { theme } from 'src/theme'

const SIDEBAR_COLLAPSED_WIDTH = '48px'
const SIDEBAR_EXPANDED_WIDTH = '260px'

type SidebarOpenProps = {
  $isOpen?: boolean
}

export const SidebarOverlay = styled.div<SidebarOpenProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 900;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition:
    opacity 0.2s,
    visibility 0.2s;

  @media (min-width: ${theme.breakpoints.md}px) {
    display: none;
  }
`

export const SidebarContainer = styled.aside<SidebarOpenProps>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${({ $isOpen }) =>
    $isOpen ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH};
  background: ${theme.colors.gray[50]};
  border-right: 1px solid ${theme.colors.border};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease-in-out;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}px) {
    width: ${({ $isOpen }) => ($isOpen ? SIDEBAR_EXPANDED_WIDTH : '0')};
  }
`

export const SidebarHeader = styled.div<SidebarOpenProps>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isOpen }) => ($isOpen ? 'space-between' : 'center')};
  padding: ${({ $isOpen }) => ($isOpen ? '12px 12px 12px 16px' : '12px')};
  min-height: 56px;
`

export const SidebarLogoIcon = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.foreground};
  flex-shrink: 0;
  border: none;
  background: none;
  font-size: 0;
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
    stroke-width: 1.5;
    display: block;
  }
`

export const SidebarLogoText = styled(Link)<SidebarOpenProps>`
  white-space: nowrap;
  overflow: hidden;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.15s;
  margin-left: 8px;

  &:hover {
    text-decoration: none;
  }
`

export const SidebarCollapseButton = styled.button<SidebarOpenProps>`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.gray[400]};
  transition:
    color 0.15s,
    opacity 0.15s;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  flex-shrink: 0;
  border: none;
  background: none;
  font-size: 0;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.gray[600]};
  }

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.5;
    display: block;
  }
`

export const SidebarNav = styled.nav<SidebarOpenProps>`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ $isOpen }) => ($isOpen ? '8px' : '8px 0 8px 14px')};
`

export const SidebarNavItem = styled.div<SidebarOpenProps>`
  a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: ${({ $isOpen }) => ($isOpen ? '10px 12px' : '10px 0')};
    justify-content: ${({ $isOpen }) => ($isOpen ? 'flex-start' : 'center')};
    border-radius: 8px;
    font-size: 0.9375rem;
    transition: background 0.15s;
    white-space: nowrap;

    &:hover {
      background: ${theme.colors.gray[100]};
    }
  }
`

export const NavItemIcon = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0;

  svg {
    width: 20px;
    height: 20px;
    display: block;
  }
`

export const NavItemLabel = styled.span<SidebarOpenProps>`
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.15s;
  overflow: hidden;
`

export const SidebarFooter = styled.div`
  border-top: 1px solid ${theme.colors.border};
  padding: 10px;
`

export const SidebarUserSection = styled.div<SidebarOpenProps>`
  display: flex;
  justify-content: ${({ $isOpen }) => ($isOpen ? 'flex-start' : 'center')};
  align-items: center;
  width: 100%;
  flex-wrap: nowrap;
  white-space: nowrap;

  > div {
    flex-wrap: nowrap;
  }

  > button {
    display: flex;
    align-items: center;
    gap: 8px;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
  }
`

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  font-size: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  span {
    color: ${theme.colors.gray[600]};
    font-size: 0.875rem;
  }

  svg {
    width: 16px;
    height: 16px;
    stroke: ${theme.colors.gray[500]};
    display: block;
  }
`
