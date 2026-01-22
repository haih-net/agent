import { builder } from '../../../builder'
import { KBConstraintUpdateInput } from '../inputs'

builder.mutationField('updateConstraint', (t) =>
  t.prismaField({
    type: 'KBConstraint',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: KBConstraintUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const existingConstraint = await ctx.prisma.kBConstraint.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingConstraint) {
        throw new Error('Constraint not found or access denied')
      }

      return ctx.prisma.kBConstraint.update({
        ...query,
        where: { id: args.id },
        data: {
          constraint: args.data.constraint ?? undefined,
          scope: args.data.scope ?? undefined,
        },
      })
    },
  }),
)
