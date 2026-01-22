import { builder } from '../../../builder'
import { KBConstraintCreateInput } from '../inputs'

builder.mutationField('createConstraint', (t) =>
  t.prismaField({
    type: 'KBConstraint',
    args: {
      data: t.arg({ type: KBConstraintCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBConstraint.create({
        ...query,
        data: {
          constraint: args.data.constraint,
          scope: args.data.scope ?? undefined,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
