import { TaskStatusEnum } from 'src/gql/generated'
import { TaskStatusBadgeStyled } from './styles'

type TaskStatusBadgeProps = {
  status: TaskStatusEnum
  active?: boolean
}

const statusLabels: Record<TaskStatusEnum, string> = {
  [TaskStatusEnum.NEW]: 'New',
  [TaskStatusEnum.PROGRESS]: 'In Progress',
  [TaskStatusEnum.DONE]: 'Done',
  [TaskStatusEnum.REJECTED]: 'Rejected',
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  active,
}) => {
  return (
    <TaskStatusBadgeStyled $status={status} $active={active}>
      {statusLabels[status] || status}
    </TaskStatusBadgeStyled>
  )
}
