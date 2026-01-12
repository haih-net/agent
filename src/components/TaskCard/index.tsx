import { TaskFragment } from 'src/gql/generated'
import { FormattedDate } from 'src/ui-kit/format/FormattedDate'
import {
  TaskCardStyled,
  TaskCardTitle,
  TaskCardStatus,
  TaskCardMeta,
  TaskCardDescription,
} from './styles'
import { TaskStatusBadge } from '../TaskStatusBadge'
import Link from 'next/link'

type TaskCardProps = {
  task: TaskFragment
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <TaskCardStyled>
      <TaskCardTitle>
        <Link href={`/tasks/${task.id}`}>{task.title}</Link>
      </TaskCardTitle>

      <TaskCardStatus>
        {task.status && <TaskStatusBadge status={task.status} />}
      </TaskCardStatus>

      <TaskCardMeta>
        {task.createdAt && (
          <span className="date">
            <FormattedDate value={task.createdAt} format="dateShort" />
          </span>
        )}
      </TaskCardMeta>

      {task.description && (
        <TaskCardDescription>{task.description}</TaskCardDescription>
      )}
    </TaskCardStyled>
  )
}
