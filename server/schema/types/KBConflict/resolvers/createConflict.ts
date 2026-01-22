import { builder } from '../../../builder'
import { KBConflictCreateInput } from '../inputs'

builder.mutationField('createConflict', (t) =>
  t.prismaField({
    type: 'KBConflict',
    args: {
      data: t.arg({ type: KBConflictCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBConflict.create({
        ...query,
        data: {
          type: args.data.type,
          severity: args.data.severity,
          status: args.data.status ?? undefined,
          constraintId: args.data.constraintId ?? undefined,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
