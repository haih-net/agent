import { builder } from '../../../builder'

builder.mutationField('deleteReaction', (t) =>
  t.prismaField({
    type: 'EXReaction',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const existingReaction = await ctx.prisma.eXReaction.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingReaction) {
        throw new Error('Reaction not found or access denied')
      }

      return ctx.prisma.eXReaction.delete({
        ...query,
        where: { id: args.id },
      })
    },
  }),
)
