import { Page } from '../../_App/interfaces'
import { PostPageView } from './View'
import { PostPageProps } from './interfaces'
import { postPageGetInitialProps } from './postPageGetInitialProps'
import { PostStatus, usePostQuery, UserStatusEnum } from 'src/gql/generated'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'

export const PostPage: Page<PostPageProps> = ({ postId }) => {
  const response = usePostQuery({
    skip: !postId,
    variables: {
      where: {
        id: postId,
      },
    },
  })

  const post = response.data?.object

  if (!post) {
    return null
  }

  const searchable =
    post.CreatedBy?.status === UserStatusEnum.ACTIVE &&
    post.status === PostStatus.PUBLISHED

  return (
    <>
      <SeoHeaders
        title={post.title || 'Post'}
        description={post.description}
        noindex={!searchable}
        nofollow={!searchable}
      />
      <PostPageView post={post} />
    </>
  )
}

PostPage.getInitialProps = postPageGetInitialProps
