import { builder } from '../../../builder'
import { KBDecisionCreateInput } from '../inputs'

builder.mutationField('createDecision', (t) =>
  t.prismaField({
    type: 'KBDecision',
    args: {
      data: t.arg({ type: KBDecisionCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBDecision.create({
        ...query,
        data: {
          subject: args.data.subject,
          decision: args.data.decision,
          context: args.data.context ?? undefined,
          outcome: args.data.outcome ?? undefined,
          status: args.data.status ?? undefined,
          revisedById: args.data.revisedById ?? undefined,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
