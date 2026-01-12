import { Page } from '../../_App/interfaces'
import { UserPageProps } from './interfaces'
import { UserDocument, UserQuery, UserQueryVariables } from 'src/gql/generated'

export const userPageGetInitialProps: Page<UserPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const userId: string | undefined =
      typeof query.id === 'string' && query.id ? query.id : undefined

    const user = userId
      ? await apolloClient.query<UserQuery, UserQueryVariables>({
          query: UserDocument,
          variables: {
            where: {
              id: userId,
            },
          },
        })
      : undefined

    return {
      userId,
      statusCode: !user ? 404 : undefined,
    }
  }
