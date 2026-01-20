import { builder } from '../../../builder'
import { TaskWorkLogWhereInput } from '../inputs'

builder.queryField('taskWorkLogList', (t) =>
  t.prismaField({
    type: ['TaskWorkLog'],
    args: {
      where: t.arg({ type: TaskWorkLogWhereInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        return []
      }

      return ctx.prisma.taskWorkLog.findMany({
        ...query,
        where: {
          createdById: ctx.currentUser.id,
          taskId: args.where?.taskId ?? undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: { createdAt: 'desc' },
      })
    },
  }),
)
