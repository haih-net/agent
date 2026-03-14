import { builder } from '../../../builder'
import {
  buildSignableMessage,
  createServerSignToken,
} from '../helpers/signature'

export const PostSignDataPayload = builder.simpleObject('PostSignDataPayload', {
  fields: (t) => ({
    message: t.string(),
    serverToken: t.string(),
  }),
})

builder.queryField('getPostSignData', (t) =>
  t.field({
    type: PostSignDataPayload,
    args: {
      postId: t.arg.string({ required: true }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const post = await ctx.prisma.post.findUnique({
        where: { id: args.postId },
      })

      if (!post) {
        throw new Error('Post not found')
      }

      if (post.createdById !== ctx.currentUser.id) {
        throw new Error('Forbidden')
      }

      const signableData = {
        id: post.id,
        title: post.title,
        description: post.description,
        intro: post.intro,
        content: post.content,
        status: post.status,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      }

      const message = buildSignableMessage(signableData)
      const serverToken = createServerSignToken(signableData)

      return {
        message,
        serverToken,
      }
    },
  }),
)
