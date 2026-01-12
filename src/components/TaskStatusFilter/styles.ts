import styled, { css } from 'styled-components'

export const TaskStatusFilterStyled = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

export const TaskStatusFilterLabel = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
`

export const TaskStatusFilterButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

export const TaskStatusFilterClearButton = styled.button<{ $active?: boolean }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.backgrounds.paper};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.backgrounds.page};
  }

  ${({ $active }) =>
    $active &&
    css`
      background: ${({ theme }) => theme.colors.primary};
      color: white;
      border-color: ${({ theme }) => theme.colors.primary};
    `}
`
