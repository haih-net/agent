import { builder } from '../../../builder'

builder.mutationField('deleteIdentityOperation', (t) =>
  t.prismaField({
    type: 'KBIdentityOperation',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const existingOperation = await ctx.prisma.kBIdentityOperation.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingOperation) {
        throw new Error('Identity operation not found or access denied')
      }

      return ctx.prisma.kBIdentityOperation.delete({
        ...query,
        where: { id: args.id },
      })
    },
  }),
)
