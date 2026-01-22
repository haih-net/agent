import { builder } from '../../../builder'
import { KBFactUpdateInput } from '../inputs'

builder.mutationField('updateFact', (t) =>
  t.prismaField({
    type: 'KBFact',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: KBFactUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      // Check if fact exists and belongs to user
      const existingFact = await ctx.prisma.kBFact.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingFact) {
        throw new Error('Fact not found or access denied')
      }

      return ctx.prisma.kBFact.update({
        ...query,
        where: { id: args.id },
        data: {
          type: args.data.type ?? undefined,
          statement: args.data.statement ?? undefined,
          validFrom: args.data.validFrom ?? undefined,
          validTo: args.data.validTo ?? undefined,
          confidence: args.data.confidence ?? undefined,
          importance: args.data.importance ?? undefined,
          source: args.data.source ?? undefined,
          status: args.data.status ?? undefined,
        },
      })
    },
  }),
)
