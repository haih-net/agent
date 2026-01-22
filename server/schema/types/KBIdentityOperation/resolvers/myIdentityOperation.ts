import { builder } from '../../../builder'

builder.queryField('myIdentityOperation', (t) =>
  t.prismaField({
    type: 'KBIdentityOperation',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const operation = await ctx.prisma.kBIdentityOperation.findFirst({
        ...query,
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!operation) {
        throw new Error('Identity operation not found or access denied')
      }

      return operation
    },
  }),
)
