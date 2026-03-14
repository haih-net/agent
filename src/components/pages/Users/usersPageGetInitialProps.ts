import { Page } from '../_App/interfaces'
import {
  UsersConnectionDocument,
  UsersConnectionQuery,
  UsersConnectionQueryVariables,
} from 'src/gql/generated'
import { getUsersQueryVariables } from './helpers'
import { getCurrentUser } from 'src/helpers/getCurrentUser'
import { UsersPageProps } from './interfaces'

export const usersPageGetInitialProps: Page<UsersPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const pageParam = query.page
    const page =
      typeof pageParam === 'string' && parseInt(pageParam, 10) > 0
        ? parseInt(pageParam, 10)
        : 1

    const currentUser = getCurrentUser(apolloClient)

    await apolloClient.query<
      UsersConnectionQuery,
      UsersConnectionQueryVariables
    >({
      query: UsersConnectionDocument,
      variables: getUsersQueryVariables({
        page,
        currentUser,
      }),
    })

    return {
      page,
    }
  }
