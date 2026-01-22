import { builder } from '../../../builder'

builder.mutationField('deleteKnowledgeSpace', (t) =>
  t.prismaField({
    type: 'KBKnowledgeSpace',
    args: {
      id: t.arg.string({ required: true }),
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

      return ctx.prisma.kBKnowledgeSpace.delete({
        ...query,
        where: { id: args.id },
      })
    },
  }),
)
