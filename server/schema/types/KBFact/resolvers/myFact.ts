import { builder } from '../../../builder'

builder.queryField('myFact', (t) =>
  t.prismaField({
    type: 'KBFact',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const fact = await ctx.prisma.kBFact.findFirst({
        ...query,
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!fact) {
        throw new Error('Fact not found or access denied')
      }

      return fact
    },
  }),
)
