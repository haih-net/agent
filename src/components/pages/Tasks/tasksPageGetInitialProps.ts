import { Page } from '../_App/interfaces'
import { TasksPageProps } from './interfaces'
import {
  TasksWithCountDocument,
  TasksWithCountQuery,
  TasksWithCountQueryVariables,
  TaskStatusEnum,
} from 'src/gql/generated'
import { getTasksWithCountQueryVariables } from './helpers'

const PAGE_SIZE = 20

export const tasksPageGetInitialProps: Page<TasksPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const queryStatus = query.status
    const selectedStatus =
      queryStatus && typeof queryStatus === 'string'
        ? (queryStatus as TaskStatusEnum)
        : null

    const pageParam = query.page
    const page =
      typeof pageParam === 'string' && parseInt(pageParam, 10) > 0
        ? parseInt(pageParam, 10)
        : 1

    const variables = getTasksWithCountQueryVariables(
      selectedStatus,
      page,
      PAGE_SIZE,
    )

    await apolloClient.query<TasksWithCountQuery, TasksWithCountQueryVariables>(
      {
        query: TasksWithCountDocument,
        variables,
      },
    )

    return {
      selectedStatus,
      page,
    }
  }
