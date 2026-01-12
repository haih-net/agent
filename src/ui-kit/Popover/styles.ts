import styled from 'styled-components'

export const PopoverWrapper = styled.div`
  position: relative;
  display: inline-block;
`

export const PopoverTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background: ${({ theme }) => theme.backgrounds.paper};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

export const PopoverContent = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.sm});
  left: 0;
  z-index: 100;
  min-width: 280px;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.backgrounds.paper};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`

export const PopoverArrow = styled.div`
  position: absolute;
  top: -6px;
  left: ${({ theme }) => theme.spacing.lg};
  width: 12px;
  height: 12px;
  background: ${({ theme }) => theme.backgrounds.paper};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  transform: rotate(45deg);
`
