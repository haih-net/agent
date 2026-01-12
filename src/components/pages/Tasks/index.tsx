import { useTasksWithCountQuery } from 'src/gql/generated'
import { Page } from '../_App/interfaces'
import { TasksPageProps } from './interfaces'
import { TasksView } from './View'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { getTasksWithCountQueryVariables } from './helpers'
import { tasksPageGetInitialProps } from './tasksPageGetInitialProps'

const PAGE_SIZE = 20

export const TasksPage: Page<TasksPageProps> = ({ selectedStatus, page }) => {
  const variables = getTasksWithCountQueryVariables(
    selectedStatus,
    page,
    PAGE_SIZE,
  )

  const response = useTasksWithCountQuery({
    variables,
    pollInterval: 60000,
  })

  const tasks = response.data?.tasks || []
  const totalCount = response.data?.tasksCount || 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <>
      <SeoHeaders title="Tasks" />
      <TasksView
        tasks={tasks}
        loading={response.loading}
        currentPage={page}
        totalPages={totalPages}
      />
    </>
  )
}

TasksPage.getInitialProps = tasksPageGetInitialProps
