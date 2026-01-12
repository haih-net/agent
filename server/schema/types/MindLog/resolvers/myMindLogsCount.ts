import { builder } from '../../../builder'
import { MindLogWhereInput } from '../inputs'

builder.queryField('myMindLogsCount', (t) =>
  t.int({
    args: {
      where: t.arg({ type: MindLogWhereInput }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.currentUser) {
        return 0
      }

      const typeFilter = args.where?.type
      const typeCondition = typeFilter?.in
        ? { in: typeFilter.in }
        : typeFilter?.equals
          ? typeFilter.equals
          : undefined

      return ctx.prisma.mindLog.count({
        where: {
          createdById: ctx.currentUser.id,
          type: typeCondition,
          relatedToUserId: args.where?.relatedToUserId ?? undefined,
        },
      })
    },
  }),
)
