import { builder } from '../../../builder'
import { EXReflexUpdateInput } from '../inputs'

builder.mutationField('updateReflex', (t) =>
  t.prismaField({
    type: 'EXReflex',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: EXReflexUpdateInput, required: true }),
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

      return ctx.prisma.eXReflex.update({
        ...query,
        where: { id: args.id },
        data: {
          type: args.data.type ?? undefined,
          status: args.data.status ?? undefined,
          stimulus: args.data.stimulus ?? undefined,
          response: args.data.response ?? undefined,
          effectiveness: args.data.effectiveness ?? undefined,
          executionRate: args.data.executionRate ?? undefined,
        },
      })
    },
  }),
)
