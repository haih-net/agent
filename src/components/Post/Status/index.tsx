import React from 'react'
import { PostFragment, PostStatus } from 'src/gql/generated'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'

type PostStatusProps = {
  post: PostFragment
}

export const PostStatusChip: React.FC<PostStatusProps> = ({ post }) => {
  let label: string
  let variant: ComponentVariant

  switch (post.status) {
    case PostStatus.DRAFT:
      label = 'Draft'
      variant = ComponentVariant.WARNING
      break

    case PostStatus.UNPUBLISHED:
      label = 'Unpublished'
      variant = ComponentVariant.DANGER

      break

    case PostStatus.PUBLISHED:
    default:
      return null
  }

  return (
    <Button disabled variant={variant}>
      {label}
    </Button>
  )
}
