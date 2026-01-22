import { builder } from '../../../builder'

builder.queryField('myLabel', (t) =>
  t.prismaField({
    type: 'KBLabel',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      const label = await ctx.prisma.kBLabel.findFirst({
        ...query,
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!label) {
        throw new Error('Label not found or access denied')
      }

      return label
    },
  }),
)
