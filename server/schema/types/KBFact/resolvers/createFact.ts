import { builder } from '../../../builder'
import { KBFactCreateInput } from '../inputs'

builder.mutationField('createFact', (t) =>
  t.prismaField({
    type: 'KBFact',
    args: {
      data: t.arg({ type: KBFactCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBFact.create({
        ...query,
        data: {
          type: args.data.type,
          statement: args.data.statement,
          validFrom: args.data.validFrom ?? undefined,
          validTo: args.data.validTo ?? undefined,
          confidence: args.data.confidence ?? undefined,
          importance: args.data.importance ?? undefined,
          source: args.data.source ?? undefined,
          status: args.data.status ?? undefined,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
