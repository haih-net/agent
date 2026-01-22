import { builder } from '../../../builder'
import { KBKnowledgeSpaceCreateInput } from '../inputs'

builder.mutationField('createKnowledgeSpace', (t) =>
  t.prismaField({
    type: 'KBKnowledgeSpace',
    args: {
      data: t.arg({ type: KBKnowledgeSpaceCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBKnowledgeSpace.create({
        ...query,
        data: {
          name: args.data.name,
          type: args.data.type ?? undefined,
          description: args.data.description ?? undefined,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
