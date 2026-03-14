import Link from 'next/link'
import { PostFragment, PostStatus } from 'src/gql/generated'
import { FormattedDate } from 'src/ui-kit/format/FormattedDate'
import { Markdown } from 'src/components/Markdown'
import {
  PostStyled,
  PostBannerStyled,
  PostTitleStyled,
  PostDescriptionStyled,
  PostMetaStyled,
  PostAuthorStyled,
  PostDateStyled,
  PostIntroStyled,
  PostContentStyled,
  PostStyledToolbar,
} from './styles'
import { UserLink } from '../Link/User'
import { useAppContext } from '../AppContext'
import { Button } from 'src/ui-kit/Button'
import { useBoolean } from 'src/hooks/useBoolean'
import { PostEditForm } from '../pages/Posts/Post/Form'
import { CreatePostComment } from './CreateComment'
import { SeparatorStyled } from '../Separator/styles'
import { PostStatusChip } from './Status'

type PostVariant = 'list' | 'full'

type PostProps = {
  post: PostFragment
  variant?: PostVariant
}

export const Post: React.FC<PostProps> = ({ post, variant = 'list' }) => {
  const title = post.title || 'Untitled'

  const isPublished = post.status === PostStatus.PUBLISHED

  const titleElement = (
    <PostTitleStyled $variant={variant}>{title}</PostTitleStyled>
  )

  const { user: currentUser } = useAppContext()

  const [inEditMode, startEditing, stopEditing] = useBoolean()

  const canEdit =
    currentUser && post.createdById === currentUser.id && variant === 'full'

  return inEditMode ? (
    <PostEditForm
      post={post}
      cancelHandler={stopEditing}
      parentId={undefined}
    />
  ) : (
    <PostStyled $variant={variant}>
      {variant === 'full' && !isPublished && (
        <PostBannerStyled>This post is not published</PostBannerStyled>
      )}

      <PostStyledToolbar>
        {variant === 'list' ? (
          <Link href={`/posts/${post.id}`}>{titleElement}</Link>
        ) : (
          titleElement
        )}

        <SeparatorStyled />
        <PostStatusChip post={post} />
        {canEdit && <Button onClick={startEditing}>Edit</Button>}
      </PostStyledToolbar>

      {variant === 'list' && post.description && (
        <PostDescriptionStyled>{post.description}</PostDescriptionStyled>
      )}

      <PostMetaStyled>
        {post.CreatedBy && (
          <PostAuthorStyled>
            <UserLink user={post.CreatedBy} />
          </PostAuthorStyled>
        )}
        {post.createdAt && (
          <PostDateStyled>
            <FormattedDate value={post.createdAt} format="dateMedium" />
          </PostDateStyled>
        )}
      </PostMetaStyled>

      {variant === 'list' ? (
        <>
          <PostIntroStyled>{post.intro}</PostIntroStyled>
        </>
      ) : (
        <>
          <PostContentStyled>
            <Markdown>{post.content}</Markdown>
          </PostContentStyled>

          {currentUser && <CreatePostComment post={post} />}
        </>
      )}
    </PostStyled>
  )
}
