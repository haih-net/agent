import { builder } from '../../../builder'

builder.queryField('myDecision', (t) =>
  t.prismaField({
    type: 'KBDecision',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const decision = await ctx.prisma.kBDecision.findFirst({
        ...query,
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!decision) {
        throw new Error('Decision not found or access denied')
      }

      return decision
    },
  }),
)
