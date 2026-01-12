import React from 'react'
import { TaskFragment } from 'src/gql/generated'
import { TaskCard } from 'src/components/TaskCard'
import { TaskStatusFilter } from 'src/components/TaskStatusFilter'
import { TasksViewStyled, TasksViewGridStyled } from './styles'
import { Pagination } from 'src/components/Pagination'

type TasksViewProps = {
  tasks: TaskFragment[]
  loading?: boolean
  currentPage: number
  totalPages: number
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  loading,
  currentPage,
  totalPages,
}) => {
  return (
    <TasksViewStyled>
      <h1>Tasks</h1>

      <TaskStatusFilter />

      {loading && tasks.length === 0 ? (
        <p>Loading...</p>
      ) : tasks.length > 0 ? (
        <>
          <TasksViewGridStyled>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TasksViewGridStyled>

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        <p>No tasks found</p>
      )}
    </TasksViewStyled>
  )
}
