import { builder } from '../../../builder'
import { EXReactionCreateInput } from '../inputs'

builder.mutationField('createReaction', (t) =>
  t.prismaField({
    type: 'EXReaction',
    args: {
      data: t.arg({ type: EXReactionCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      // Verify reflex exists and belongs to user
      const reflex = await ctx.prisma.eXReflex.findFirst({
        where: {
          id: args.data.reflexId,
          createdById: ctx.currentUser.id,
        },
      })

      if (!reflex) {
        throw new Error('Reflex not found or access denied')
      }

      return ctx.prisma.eXReaction.create({
        ...query,
        data: {
          reflexId: args.data.reflexId,
          stimulus: args.data.stimulus,
          result: args.data.result,
          tokensUsed: args.data.tokensUsed ?? undefined,
          durationMs: args.data.durationMs ?? undefined,
          scoreAgent: args.data.scoreAgent ?? undefined,
          relatedToUserId: args.data.relatedToUserId ?? undefined,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
