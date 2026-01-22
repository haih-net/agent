import { builder } from '../../../builder'

builder.mutationField('deleteDecision', (t) =>
  t.prismaField({
    type: 'KBDecision',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const existingDecision = await ctx.prisma.kBDecision.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingDecision) {
        throw new Error('Decision not found or access denied')
      }

      return ctx.prisma.kBDecision.delete({
        ...query,
        where: { id: args.id },
      })
    },
  }),
)
