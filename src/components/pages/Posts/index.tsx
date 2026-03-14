import { Page } from '../_App/interfaces'
import { PostsPageView } from './View'
import { postsPageGetInitialProps } from './postsPageGetInitialProps'
import { usePostsConnectionQuery } from 'src/gql/generated'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { PostsPageProps } from './interfaces'
import { getPostsConnectionQueryVariables } from './helpers'
import { useAppContext } from 'src/components/AppContext'

export const PostsPage: Page<PostsPageProps> = ({ page }) => {
  const { user: currentUser } = useAppContext()

  const postsResponse = usePostsConnectionQuery({
    variables: getPostsConnectionQueryVariables({
      page,
      currentUser,
    }),
  })

  const posts = postsResponse.data?.posts
  const count = postsResponse.data?.postsCount ?? 0

  return (
    <>
      <SeoHeaders title="Posts" />
      <PostsPageView posts={posts ?? []} count={count} page={page} />
    </>
  )
}

PostsPage.getInitialProps = postsPageGetInitialProps
