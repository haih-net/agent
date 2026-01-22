import { builder } from '../../../builder'
import { KBFactProjectionUpdateInput } from '../inputs'

builder.mutationField('updateFactProjection', (t) =>
  t.prismaField({
    type: 'KBFactProjection',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: KBFactProjectionUpdateInput, required: true }),
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

      return ctx.prisma.kBFactProjection.update({
        ...query,
        where: { id: args.id },
        data: {
          visibility: args.data.visibility ?? undefined,
          trustLevel: args.data.trustLevel ?? undefined,
          importance: args.data.importance ?? undefined,
          notes: args.data.notes ?? undefined,
        },
      })
    },
  }),
)
