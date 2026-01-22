import { builder } from '../../../builder'
import { KBConflictUpdateInput } from '../inputs'

builder.mutationField('updateConflict', (t) =>
  t.prismaField({
    type: 'KBConflict',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: KBConflictUpdateInput, required: true }),
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

      return ctx.prisma.kBConflict.update({
        ...query,
        where: { id: args.id },
        data: {
          type: args.data.type ?? undefined,
          severity: args.data.severity ?? undefined,
          status: args.data.status ?? undefined,
          constraintId: args.data.constraintId ?? undefined,
        },
      })
    },
  }),
)
