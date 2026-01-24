import { builder } from '../../../builder'
import { TaskWhereInput } from '../inputs'
import { buildTaskWhere } from '../helpers'

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
        where: buildTaskWhere(args.where, { myOnly: true }, ctx),
      })
    },
  }),
)
