import { Page } from '../../_App/interfaces'
import { PostPageProps } from './interfaces'
import { PostDocument, PostQuery, PostQueryVariables } from 'src/gql/generated'

export const postPageGetInitialProps: Page<PostPageProps>['getInitialProps'] =
  async ({ query, apolloClient }) => {
    const postId: string | undefined =
      typeof query.id === 'string' && query.id ? query.id : undefined

    const post = postId
      ? await apolloClient.query<PostQuery, PostQueryVariables>({
          query: PostDocument,
          variables: {
            where: {
              id: postId,
            },
          },
        })
      : undefined

    return {
      postId,
      statusCode: !post?.data?.object ? 404 : undefined,
    }
  }
