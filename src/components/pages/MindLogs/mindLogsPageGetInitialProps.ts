import { Page } from '../_App/interfaces'
import { MindLogsPageProps } from './interfaces'
import {
  MindLogsWithCountDocument,
  MindLogsWithCountQuery,
  MindLogsWithCountQueryVariables,
} from 'src/gql/generated'
import { getMindLogsWithCountQueryVariables } from './helpers'

const PAGE_SIZE = 20

export const mindLogsPageGetInitialProps: Page<MindLogsPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const pageParam = query.page
    const page =
      typeof pageParam === 'string' && parseInt(pageParam, 10) > 0
        ? parseInt(pageParam, 10)
        : 1

    const variables = getMindLogsWithCountQueryVariables(page, PAGE_SIZE)

    await apolloClient.query<
      MindLogsWithCountQuery,
      MindLogsWithCountQueryVariables
    >({
      query: MindLogsWithCountDocument,
      variables,
    })

    return {
      page,
    }
  }
