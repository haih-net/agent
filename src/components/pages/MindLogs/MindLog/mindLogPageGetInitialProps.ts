import { Page } from '../../_App/interfaces'
import { MindLogPageProps } from './interfaces'
import {
  MindLogDocument,
  MindLogQuery,
  MindLogQueryVariables,
} from 'src/gql/generated'
import { getMindLogQueryVariables } from '../helpers'

export const mindLogPageGetInitialProps: Page<MindLogPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const mindLogId: string | undefined =
      typeof query.id === 'string' && query.id ? query.id : undefined

    const variables = getMindLogQueryVariables(mindLogId)

    const mindLog = mindLogId
      ? await apolloClient.query<MindLogQuery, MindLogQueryVariables>({
          query: MindLogDocument,
          variables,
        })
      : undefined

    return {
      mindLogId,
      statusCode: !mindLog?.data?.response ? 404 : undefined,
    }
  }
