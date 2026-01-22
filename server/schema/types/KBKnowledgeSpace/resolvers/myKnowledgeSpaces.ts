import { builder } from '../../../builder'
import {
  KBKnowledgeSpaceOrderByInput,
  KBKnowledgeSpaceWhereInput,
} from '../inputs'

builder.queryField('myKnowledgeSpaces', (t) =>
  t.prismaField({
    type: ['KBKnowledgeSpace'],
    args: {
      where: t.arg({ type: KBKnowledgeSpaceWhereInput }),
      orderBy: t.arg({ type: KBKnowledgeSpaceOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBKnowledgeSpace.findMany({
        ...query,
        where: {
          createdById: ctx.currentUser.id,
          type: args.where?.type ?? undefined,
          name: args.where?.name
            ? { contains: args.where.name, mode: 'insensitive' }
            : undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: args.orderBy?.createdAt ?? 'desc',
          name: args.orderBy?.name ?? undefined,
          type: args.orderBy?.type ?? undefined,
        },
      })
    },
  }),
)
