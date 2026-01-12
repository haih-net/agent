import { builder } from '../../../builder'
import { MindLogWhereInput } from '../inputs'

builder.queryField('mindLogsCount', (t) =>
  t.int({
    args: {
      where: t.arg({ type: MindLogWhereInput }),
    },
    resolve: async (_root, args, ctx) => {
      const typeFilter = args.where?.type
      const typeCondition = typeFilter?.in
        ? { in: typeFilter.in }
        : typeFilter?.equals
          ? typeFilter.equals
          : undefined

      return ctx.prisma.mindLog.count({
        where: {
          type: typeCondition,
          relatedToUserId: args.where?.relatedToUserId ?? undefined,
        },
      })
    },
  }),
)
