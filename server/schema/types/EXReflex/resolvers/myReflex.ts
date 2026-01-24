import { builder } from '../../../builder'

builder.queryField('myReflex', (t) =>
  t.prismaField({
    type: 'EXReflex',
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.eXReflex.findFirst({
        ...query,
        where: {
          id: args.id,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
