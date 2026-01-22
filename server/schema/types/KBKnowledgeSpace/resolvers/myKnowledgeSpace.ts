import { builder } from '../../../builder'

builder.queryField('myKnowledgeSpace', (t) =>
  t.prismaField({
    type: 'KBKnowledgeSpace',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const space = await ctx.prisma.kBKnowledgeSpace.findFirst({
        ...query,
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!space) {
        throw new Error('Knowledge space not found or access denied')
      }

      return space
    },
  }),
)
