import { Page } from '../../_App/interfaces'
import { TaskPageProps } from './interfaces'
import { TaskDocument, TaskQuery, TaskQueryVariables } from 'src/gql/generated'
import { getTaskQueryVariables } from '../helpers'

export const taskPageGetInitialProps: Page<TaskPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const taskId: string | undefined =
      typeof query.id === 'string' && query.id ? query.id : undefined

    const variables = getTaskQueryVariables(taskId)

    const task = taskId
      ? await apolloClient.query<TaskQuery, TaskQueryVariables>({
          query: TaskDocument,
          variables,
        })
      : undefined

    return {
      taskId,
      statusCode: !task ? 404 : undefined,
    }
  }
