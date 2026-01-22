import { builder } from '../../../builder'
import {
  KBIdentityOperationOrderByInput,
  KBIdentityOperationWhereInput,
} from '../inputs'

builder.queryField('myIdentityOperations', (t) =>
  t.prismaField({
    type: ['KBIdentityOperation'],
    args: {
      where: t.arg({ type: KBIdentityOperationWhereInput }),
      orderBy: t.arg({ type: KBIdentityOperationOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBIdentityOperation.findMany({
        ...query,
        where: {
          createdById: ctx.currentUser.id,
          operation: args.where?.operation ?? undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: args.orderBy?.createdAt ?? 'desc',
          operation: args.orderBy?.operation ?? undefined,
        },
      })
    },
  }),
)
