import styled, { css } from 'styled-components'
import { TaskStatusEnum } from 'src/gql/generated'

const statusColors: Record<TaskStatusEnum, { bg: string; text: string }> = {
  [TaskStatusEnum.NEW]: { bg: '#e3f2fd', text: '#1976d2' },
  [TaskStatusEnum.PROGRESS]: { bg: '#fff3e0', text: '#f57c00' },
  [TaskStatusEnum.DONE]: { bg: '#e8f5e9', text: '#388e3c' },
  [TaskStatusEnum.REJECTED]: { bg: '#ffebee', text: '#d32f2f' },
}

export const TaskStatusBadgeStyled = styled.span<{
  $status: TaskStatusEnum
  $active?: boolean
}>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  ${({ $status }) => {
    const colors = statusColors[$status] || { bg: '#f5f5f5', text: '#666' }
    return css`
      background: ${colors.bg};
      color: ${colors.text};
    `
  }}

  ${({ $active }) =>
    $active === false &&
    css`
      opacity: 0.5;
    `}
`
