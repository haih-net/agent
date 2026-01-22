import { builder } from '../../../builder'
import { KBDecisionOrderByInput, KBDecisionWhereInput } from '../inputs'

builder.queryField('myDecisions', (t) =>
  t.prismaField({
    type: ['KBDecision'],
    args: {
      where: t.arg({ type: KBDecisionWhereInput }),
      orderBy: t.arg({ type: KBDecisionOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBDecision.findMany({
        ...query,
        where: {
          createdById: ctx.currentUser.id,
          status: args.where?.status ?? undefined,
          subject: args.where?.subject
            ? { contains: args.where.subject, mode: 'insensitive' }
            : undefined,
          revisedById: args.where?.revisedById ?? undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: args.orderBy?.createdAt ?? 'desc',
          status: args.orderBy?.status ?? undefined,
          subject: args.orderBy?.subject ?? undefined,
        },
      })
    },
  }),
)
