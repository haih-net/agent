import { builder } from '../../../builder'

builder.queryField('myConflict', (t) =>
  t.prismaField({
    type: 'KBConflict',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const conflict = await ctx.prisma.kBConflict.findFirst({
        ...query,
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!conflict) {
        throw new Error('Conflict not found or access denied')
      }

      return conflict
    },
  }),
)
