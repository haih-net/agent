import { builder } from '../../../builder'

builder.mutationField('deleteFact', (t) =>
  t.prismaField({
    type: 'KBFact',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      // Check if fact exists and belongs to user
      const existingFact = await ctx.prisma.kBFact.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingFact) {
        throw new Error('Fact not found or access denied')
      }

      return ctx.prisma.kBFact.delete({
        ...query,
        where: { id: args.id },
      })
    },
  }),
)
