import { builder } from '../../../builder'
import { EXReactionUpdateInput } from '../inputs'

builder.mutationField('updateReaction', (t) =>
  t.prismaField({
    type: 'EXReaction',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: EXReactionUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const existingReaction = await ctx.prisma.eXReaction.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingReaction) {
        throw new Error('Reaction not found or access denied')
      }

      return ctx.prisma.eXReaction.update({
        ...query,
        where: { id: args.id },
        data: {
          result: args.data.result ?? undefined,
          tokensUsed: args.data.tokensUsed ?? undefined,
          durationMs: args.data.durationMs ?? undefined,
          scoreAgent: args.data.scoreAgent ?? undefined,
          scoreTarget: args.data.scoreTarget ?? undefined,
          scoreMentor: args.data.scoreMentor ?? undefined,
          feedback: args.data.feedback ?? undefined,
        },
      })
    },
  }),
)
