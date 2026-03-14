import { builder } from '../../builder'

import './inputs'
import './resolvers/createPost'
import './resolvers/updatePost'
import './resolvers/deletePost'
import './resolvers/post'
import './resolvers/posts'
import './resolvers/getPostSignData'
import './resolvers/signPost'
import './resolvers/postGuidelines'
import './resolvers/validatePost'
import './resolvers/postsCount'
import { PostStatusEnum } from './types'

builder.prismaObject('Post', {
  fields: (t) => ({
    id: t.exposeID('id'),
    parentId: t.exposeID('parentId'),
    rootId: t.exposeID('rootId'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    status: t.field({
      type: PostStatusEnum,
      resolve: (post) => post.status,
    }),
    revision: t.exposeInt('revision'),
    title: t.exposeString('title', { nullable: true }),
    description: t.exposeString('description', { nullable: true }),
    intro: t.exposeString('intro', { nullable: true }),
    content: t.exposeString('content'),
    signature: t.exposeString('signature', { nullable: true }),
    createdById: t.exposeString('createdById'),
    CreatedBy: t.relation('CreatedBy'),
    Revisions: t.relation('Revisions', {
      query: { orderBy: { createdAt: 'desc' } },
    }),
  }),
})

builder.prismaObject('PostRevision', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    status: t.field({
      type: PostStatusEnum,
      resolve: (revision) => revision.status,
    }),
    title: t.exposeString('title', { nullable: true }),
    description: t.exposeString('description', { nullable: true }),
    intro: t.exposeString('intro', { nullable: true }),
    content: t.exposeString('content'),
    signature: t.exposeString('signature', { nullable: true }),
    postId: t.exposeString('postId'),
  }),
})
