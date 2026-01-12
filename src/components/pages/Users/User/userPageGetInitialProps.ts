import { Page } from '../../_App/interfaces'
import { UserPageProps } from './interfaces'
import { UserDocument, UserQuery, UserQueryVariables } from 'src/gql/generated'
import { getUserQueryVariables } from './helpers'

export const userPageGetInitialProps: Page<UserPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const userId: string | undefined =
      typeof query.id === 'string' && query.id ? query.id : undefined

    const variables = getUserQueryVariables(userId)

    const user = userId
      ? await apolloClient.query<UserQuery, UserQueryVariables>({
          query: UserDocument,
          variables,
        })
      : undefined

    return {
      userId,
      statusCode: !user ? 404 : undefined,
    }
  }
