import { TaskStatus } from '@prisma/client'
import { builder } from '../../../builder'
import { TaskWhereInput } from '../inputs'

builder.queryField('tasksCount', (t) =>
  t.int({
    args: {
      where: t.arg({ type: TaskWhereInput }),
    },
    resolve: async (_root, args, ctx) => {
      const completedStatuses = [TaskStatus.Done]
      const incompletedOnly = args.where?.incompletedOnly ?? true

      return ctx.prisma.task.count({
        where: {
          status:
            args.where?.status ??
            (incompletedOnly ? { notIn: completedStatuses } : undefined),
          parentId: args.where?.parentId ?? undefined,
        },
      })
    },
  }),
)
