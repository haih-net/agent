import { builder } from '../../../builder'

builder.queryField('myFactProjection', (t) =>
  t.prismaField({
    type: 'KBFactProjection',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const projection = await ctx.prisma.kBFactProjection.findFirst({
        ...query,
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!projection) {
        throw new Error('Fact projection not found or access denied')
      }

      return projection
    },
  }),
)
