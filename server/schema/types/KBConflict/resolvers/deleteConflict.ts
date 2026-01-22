import { builder } from '../../../builder'

builder.mutationField('deleteConflict', (t) =>
  t.prismaField({
    type: 'KBConflict',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const existingConflict = await ctx.prisma.kBConflict.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingConflict) {
        throw new Error('Conflict not found or access denied')
      }

      return ctx.prisma.kBConflict.delete({
        ...query,
        where: { id: args.id },
      })
    },
  }),
)
