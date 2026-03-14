import { Page } from '../_App/interfaces'
import {
  PostsConnectionDocument,
  PostsConnectionQuery,
  PostsConnectionQueryVariables,
} from 'src/gql/generated'
import { PostsPageProps } from './interfaces'
import { getPostsConnectionQueryVariables } from './helpers'
import { getCurrentUser } from 'src/helpers/getCurrentUser'

export const postsPageGetInitialProps: Page<PostsPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const pageParam = query.page
    const page =
      typeof pageParam === 'string' && parseInt(pageParam, 10) > 0
        ? parseInt(pageParam, 10)
        : 1

    const currentUser = getCurrentUser(apolloClient)

    await apolloClient.query<
      PostsConnectionQuery,
      PostsConnectionQueryVariables
    >({
      query: PostsConnectionDocument,
      variables: getPostsConnectionQueryVariables({
        page,
        currentUser,
      }),
    })

    return {
      page,
    }
  }
