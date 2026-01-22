import { builder } from '../../../builder'
import { KBDecisionUpdateInput } from '../inputs'

builder.mutationField('updateDecision', (t) =>
  t.prismaField({
    type: 'KBDecision',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: KBDecisionUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const existingDecision = await ctx.prisma.kBDecision.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingDecision) {
        throw new Error('Decision not found or access denied')
      }

      return ctx.prisma.kBDecision.update({
        ...query,
        where: { id: args.id },
        data: {
          subject: args.data.subject ?? undefined,
          decision: args.data.decision ?? undefined,
          context: args.data.context ?? undefined,
          outcome: args.data.outcome ?? undefined,
          status: args.data.status ?? undefined,
          revisedById: args.data.revisedById ?? undefined,
        },
      })
    },
  }),
)
