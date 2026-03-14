import { PostStatus } from '@prisma/client'
import { builder } from 'server/schema/builder'

export const PostStatusEnum = builder.enumType('PostStatus', {
  values: Object.values(PostStatus),
})
