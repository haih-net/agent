import { builder } from '../../../builder'
import { EXReflexOrderByInput, EXReflexWhereInput } from '../inputs'

builder.queryField('myReflexes', (t) =>
  t.prismaField({
    type: ['EXReflex'],
    args: {
      where: t.arg({ type: EXReflexWhereInput }),
      orderBy: t.arg({ type: EXReflexOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.eXReflex.findMany({
        ...query,
        where: {
          createdById: ctx.currentUser.id,
          type: args.where?.type ?? undefined,
          status: args.where?.status ?? undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: args.orderBy?.createdAt ?? 'desc',
          effectiveness: args.orderBy?.effectiveness ?? undefined,
          executionRate: args.orderBy?.executionRate ?? undefined,
        },
      })
    },
  }),
)
