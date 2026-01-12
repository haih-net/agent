import { builder } from '../../../builder'
import { TaskWhereInput } from '../inputs'

builder.queryField('myTasksCount', (t) =>
  t.int({
    args: {
      where: t.arg({ type: TaskWhereInput }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.currentUser) {
        return 0
      }

      return ctx.prisma.task.count({
        where: {
          assigneeId: ctx.currentUser.id,
          status: args.where?.status ?? undefined,
          parentId: args.where?.parentId ?? undefined,
        },
      })
    },
  }),
)
