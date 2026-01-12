import { Page } from '../_App/interfaces'
import {
  UsersConnectionDocument,
  UsersConnectionQuery,
  UsersConnectionQueryVariables,
} from 'src/gql/generated'
import { getUsersQueryVariables } from './helpers'

export const usersPageGetInitialProps: Page['getInitialProps'] = async ({
  apolloClient,
}) => {
  const variables = getUsersQueryVariables()

  await apolloClient.query<UsersConnectionQuery, UsersConnectionQueryVariables>(
    {
      query: UsersConnectionDocument,
      variables,
    },
  )

  return {}
}
