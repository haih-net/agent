import { builder } from '../../../builder'
import { KBKnowledgeSpaceUpdateInput } from '../inputs'

builder.mutationField('updateKnowledgeSpace', (t) =>
  t.prismaField({
    type: 'KBKnowledgeSpace',
    args: {
      id: t.arg.string({ required: true }),
      data: t.arg({ type: KBKnowledgeSpaceUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const existingSpace = await ctx.prisma.kBKnowledgeSpace.findFirst({
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existingSpace) {
        throw new Error('Knowledge space not found or access denied')
      }

      return ctx.prisma.kBKnowledgeSpace.update({
        ...query,
        where: { id: args.id },
        data: {
          name: args.data.name ?? undefined,
          type: args.data.type ?? undefined,
          description: args.data.description ?? undefined,
        },
      })
    },
  }),
)
