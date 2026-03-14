import { builder } from '../../builder'
import { PostStatusEnum } from './types'

export const PostWhereInput = builder.inputType('PostWhereInput', {
  fields: (t) => ({
    status: t.field({ type: PostStatusEnum }),
    rootId: t.id(),
    parentId: t.id(),
  }),
})

export const PostWhereUniqueInput = builder.inputType('PostWhereUniqueInput', {
  fields: (t) => ({
    id: t.id(),
  }),
})

export const PostCreateInput = builder.inputType('PostCreateInput', {
  fields: (t) => ({
    title: t.string({ required: false }),
    description: t.string({ required: false }),
    intro: t.string({ required: false }),
    content: t.string({ required: true }),
    status: t.field({ type: PostStatusEnum, required: false }),
    parentId: t.id({
      description: 'Reply',
    }),
  }),
})

export const PostUpdateDataInput = builder.inputType('PostUpdateDataInput', {
  fields: (t) => ({
    title: t.string({ required: false }),
    description: t.string({ required: false }),
    intro: t.string({ required: false }),
    content: t.string({ required: false }),
    status: t.field({ type: PostStatusEnum, required: false }),
  }),
})
