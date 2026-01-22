import { builder } from '../../../builder'
import {
  KBFactProjectionOrderByInput,
  KBFactProjectionWhereInput,
} from '../inputs'

builder.queryField('myFactProjections', (t) =>
  t.prismaField({
    type: ['KBFactProjection'],
    args: {
      where: t.arg({ type: KBFactProjectionWhereInput }),
      orderBy: t.arg({ type: KBFactProjectionOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBFactProjection.findMany({
        ...query,
        where: {
          createdById: ctx.currentUser.id,
          factId: args.where?.factId ?? undefined,
          knowledgeSpaceId: args.where?.knowledgeSpaceId ?? undefined,
          visibility: args.where?.visibility ?? undefined,
          trustLevel: args.where?.trustLevel ?? undefined,
          importance: args.where?.importance ?? undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: args.orderBy?.createdAt ?? 'desc',
          trustLevel: args.orderBy?.trustLevel ?? undefined,
          importance: args.orderBy?.importance ?? undefined,
        },
      })
    },
  }),
)
