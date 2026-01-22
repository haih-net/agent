import { builder } from '../../../builder'
import { KBConflictOrderByInput, KBConflictWhereInput } from '../inputs'

builder.queryField('myConflicts', (t) =>
  t.prismaField({
    type: ['KBConflict'],
    args: {
      where: t.arg({ type: KBConflictWhereInput }),
      orderBy: t.arg({ type: KBConflictOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBConflict.findMany({
        ...query,
        where: {
          createdById: ctx.currentUser.id,
          type: args.where?.type ?? undefined,
          severity: args.where?.severity ?? undefined,
          status: args.where?.status ?? undefined,
          constraintId: args.where?.constraintId ?? undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: args.orderBy?.createdAt ?? 'desc',
          status: args.orderBy?.status ?? undefined,
          severity: args.orderBy?.severity ?? undefined,
        },
      })
    },
  }),
)
