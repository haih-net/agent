import { builder } from '../../../builder'
import { KBFactParticipationCreateInput } from '../inputs'

builder.mutationField('createFactParticipation', (t) =>
  t.prismaField({
    type: 'KBFactParticipation',
    args: {
      data: t.arg({ type: KBFactParticipationCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      // Verify that the fact belongs to the user
      const fact = await ctx.prisma.kBFact.findFirst({
        where: {
          id: args.data.factId,
          createdById: ctx.currentUser.id,
        },
      })

      if (!fact) {
        throw new Error('Fact not found or access denied')
      }

      // Verify that the concept belongs to the user
      const concept = await ctx.prisma.kBConcept.findFirst({
        where: {
          id: args.data.conceptId,
          createdById: ctx.currentUser.id,
        },
      })

      if (!concept) {
        throw new Error('Concept not found or access denied')
      }

      return ctx.prisma.kBFactParticipation.create({
        ...query,
        data: {
          factId: args.data.factId,
          conceptId: args.data.conceptId,
          role: args.data.role,
          impact: args.data.impact ?? undefined,
          value: args.data.value ?? undefined,
          localImportance: args.data.localImportance ?? undefined,
        },
      })
    },
  }),
)
