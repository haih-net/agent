import { builder } from '../../../builder'
import { EXReactionOrderByInput, EXReactionWhereInput } from '../inputs'

builder.queryField('myReactions', (t) =>
  t.prismaField({
    type: ['EXReaction'],
    args: {
      where: t.arg({ type: EXReactionWhereInput }),
      orderBy: t.arg({ type: EXReactionOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.eXReaction.findMany({
        ...query,
        where: {
          createdById: ctx.currentUser.id,
          reflexId: args.where?.reflexId ?? undefined,
          relatedToUserId: args.where?.relatedToUserId ?? undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: args.orderBy?.createdAt ?? 'desc',
          scoreAgent: args.orderBy?.scoreAgent ?? undefined,
          scoreTarget: args.orderBy?.scoreTarget ?? undefined,
          scoreMentor: args.orderBy?.scoreMentor ?? undefined,
        },
      })
    },
  }),
)
