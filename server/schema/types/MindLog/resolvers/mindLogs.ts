import { builder } from '../../../builder'
import { MindLogWhereInput } from '../inputs'

builder.queryField('mindLogs', (t) =>
  t.prismaField({
    type: ['MindLog'],
    args: {
      where: t.arg({ type: MindLogWhereInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, _ctx) => {
      const typeFilter = args.where?.type
      const typeCondition = typeFilter?.in
        ? { in: typeFilter.in }
        : typeFilter?.equals
          ? typeFilter.equals
          : undefined

      return _ctx.prisma.mindLog.findMany({
        ...query,
        where: {
          type: typeCondition,
          relatedToUserId: args.where?.relatedToUserId ?? undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: { createdAt: 'desc' },
      })
    },
  }),
)
