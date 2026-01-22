import { builder } from '../../../builder'
import {
  KBFactParticipationOrderByInput,
  KBFactParticipationWhereInput,
} from '../inputs'

builder.queryField('myFactParticipations', (t) =>
  t.prismaField({
    type: ['KBFactParticipation'],
    args: {
      where: t.arg({ type: KBFactParticipationWhereInput }),
      orderBy: t.arg({ type: KBFactParticipationOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBFactParticipation.findMany({
        ...query,
        where: {
          Fact: {
            createdById: ctx.currentUser.id,
          },
          factId: args.where?.factId ?? undefined,
          conceptId: args.where?.conceptId ?? undefined,
          role: args.where?.role ?? undefined,
          impact: args.where?.impact ?? undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: args.orderBy?.createdAt ?? 'desc',
          role: args.orderBy?.role ?? undefined,
        },
      })
    },
  }),
)
