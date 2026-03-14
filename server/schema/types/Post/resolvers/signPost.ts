import { builder } from '../../../builder'
import {
  verifyServerSignToken,
  verifyUserSignature,
} from '../helpers/signature'

builder.mutationField('signPost', (t) =>
  t.prismaField({
    type: 'Post',
    args: {
      postId: t.arg.string({ required: true }),
      serverToken: t.arg.string({ required: true }),
      userSignature: t.arg.string({ required: true }),
    },
    resolve: async (_query, _root, args, ctx) => {
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

      const ethAccount = await ctx.prisma.ethAccount.findUnique({
        where: { userId: ctx.currentUser.id },
      })

      if (!ethAccount) {
        throw new Error('No EthAccount linked to user')
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

      if (!verifyServerSignToken(args.serverToken, signableData)) {
        throw new Error('Invalid or expired server token')
      }

      if (
        !verifyUserSignature(
          signableData,
          args.userSignature,
          ethAccount.address,
        )
      ) {
        throw new Error('Invalid user signature')
      }

      const updatedPost = await ctx.prisma.post.update({
        where: { id: args.postId },
        data: {
          signature: args.userSignature,
        },
      })

      return updatedPost
    },
  }),
)
