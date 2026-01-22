import { builder } from '../../../builder'
import { KBFactProjectionCreateInput } from '../inputs'

builder.mutationField('createFactProjection', (t) =>
  t.prismaField({
    type: 'KBFactProjection',
    args: {
      data: t.arg({ type: KBFactProjectionCreateInput, required: true }),
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

      // Verify that the knowledge space belongs to the user
      const space = await ctx.prisma.kBKnowledgeSpace.findFirst({
        where: {
          id: args.data.knowledgeSpaceId,
          createdById: ctx.currentUser.id,
        },
      })

      if (!space) {
        throw new Error('Knowledge space not found or access denied')
      }

      return ctx.prisma.kBFactProjection.create({
        ...query,
        data: {
          factId: args.data.factId,
          knowledgeSpaceId: args.data.knowledgeSpaceId,
          visibility: args.data.visibility ?? undefined,
          trustLevel: args.data.trustLevel ?? undefined,
          importance: args.data.importance ?? undefined,
          notes: args.data.notes ?? undefined,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
