import { builder } from '../../../builder'

builder.mutationField('deletePost', (t) =>
  t.prismaField({
    type: 'Post',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const post = await ctx.prisma.post.findUnique({
        where: { id: args.id },
      })

      if (!post) {
        throw new Error('Post not found')
      }

      if (post.createdById !== ctx.currentUser.id) {
        throw new Error('Forbidden')
      }

      await ctx.prisma.post.delete({
        where: { id: args.id },
      })

      return post
    },
  }),
)
