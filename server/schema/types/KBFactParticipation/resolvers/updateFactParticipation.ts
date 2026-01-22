import { builder } from '../../../builder'
import { KBFactParticipationUpdateInput } from '../inputs'

builder.mutationField('updateFactParticipation', (t) =>
  t.prismaField({
    type: 'KBFactParticipation',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: KBFactParticipationUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      // Check if participation exists and belongs to user (via fact)
      const existingParticipation =
        await ctx.prisma.kBFactParticipation.findFirst({
          where: {
            id: args.id,
            Fact: {
              createdById: ctx.currentUser.id,
            },
          },
        })

      if (!existingParticipation) {
        throw new Error('Fact participation not found or access denied')
      }

      return ctx.prisma.kBFactParticipation.update({
        ...query,
        where: { id: args.id },
        data: {
          role: args.data.role ?? undefined,
          impact: args.data.impact ?? undefined,
          value: args.data.value ?? undefined,
          localImportance: args.data.localImportance ?? undefined,
        },
      })
    },
  }),
)
