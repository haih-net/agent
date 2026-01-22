import { builder } from '../../../builder'

builder.mutationField('deleteFactProjection', (t) =>
  t.prismaField({
    type: 'KBFactProjection',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const existingProjection = await ctx.prisma.kBFactProjection.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingProjection) {
        throw new Error('Fact projection not found or access denied')
      }

      return ctx.prisma.kBFactProjection.delete({
        ...query,
        where: { id: args.id },
      })
    },
  }),
)
