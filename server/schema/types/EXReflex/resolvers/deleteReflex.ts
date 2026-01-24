import { builder } from '../../../builder'

builder.mutationField('deleteReflex', (t) =>
  t.prismaField({
    type: 'EXReflex',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const existingReflex = await ctx.prisma.eXReflex.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingReflex) {
        throw new Error('Reflex not found or access denied')
      }

      return ctx.prisma.eXReflex.delete({
        ...query,
        where: { id: args.id },
      })
    },
  }),
)
