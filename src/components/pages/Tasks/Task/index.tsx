import { useTaskQuery } from 'src/gql/generated'
import { Page } from '../../_App/interfaces'
import { TaskPageProps } from './interfaces'
import { TaskCard } from 'src/components/TaskCard'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { TaskPageStyled } from './styles'
import { getTaskQueryVariables } from '../helpers'
import { taskPageGetInitialProps } from './taskPageGetInitialProps'

export const TaskPage: Page<TaskPageProps> = ({ taskId }) => {
  const variables = getTaskQueryVariables(taskId)

  const response = useTaskQuery({
    variables,
    skip: !taskId,
  })

  const task = response.data?.response

  if (response.loading) {
    return (
      <TaskPageStyled>
        <p>Loading...</p>
      </TaskPageStyled>
    )
  }

  if (!task) {
    return (
      <TaskPageStyled>
        <p>Task not found</p>
      </TaskPageStyled>
    )
  }

  return (
    <>
      <SeoHeaders title={task.title || 'Task'} />
      <TaskPageStyled>
        <TaskCard task={task} />
      </TaskPageStyled>
    </>
  )
}

TaskPage.getInitialProps = taskPageGetInitialProps
