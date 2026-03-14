import { PostEditForm } from 'src/components/pages/Posts/Post/Form'
import { PostFragment } from 'src/gql/generated'
import { useBoolean } from 'src/hooks/useBoolean'
import { Button } from 'src/ui-kit/Button'

type CreatePostCommentProps = {
  post: PostFragment
}

export const CreatePostComment: React.FC<CreatePostCommentProps> = ({
  post,
}) => {
  const [inEditMode, startEditing, stopEditing] = useBoolean()

  return inEditMode ? (
    <PostEditForm
      post={undefined}
      cancelHandler={stopEditing}
      parentId={post.id}
    />
  ) : (
    <Button onClick={startEditing}>Reply</Button>
  )
}
