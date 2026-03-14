import { PostFragment } from 'src/gql/generated'
import { Post } from 'src/components/Post'

type PostPageViewProps = {
  post: PostFragment
}

export const PostPageView: React.FC<PostPageViewProps> = ({ post }) => {
  return <Post post={post} variant="full" />
}
