import { builder } from '../../../builder'

builder.queryField('myConstraint', (t) =>
  t.prismaField({
    type: 'KBConstraint',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const constraint = await ctx.prisma.kBConstraint.findFirst({
        ...query,
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!constraint) {
        throw new Error('Constraint not found or access denied')
      }

      return constraint
    },
  }),
)
