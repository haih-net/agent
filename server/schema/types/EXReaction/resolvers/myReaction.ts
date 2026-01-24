import { builder } from '../../../builder'

builder.queryField('myReaction', (t) =>
  t.prismaField({
    type: 'EXReaction',
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.eXReaction.findFirst({
        ...query,
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
