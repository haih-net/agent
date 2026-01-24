import { builder } from '../../../builder'
import { TaskOrderByInput, TaskWhereInput } from '../inputs'
import { buildTaskWhere } from '../helpers'

builder.queryField('tasks', (t) =>
  t.prismaField({
    type: ['Task'],
    args: {
      where: t.arg({ type: TaskWhereInput }),
      orderBy: t.arg({ type: TaskOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      return ctx.prisma.task.findMany({
        ...query,
        where: buildTaskWhere(args.where),
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: { createdAt: args.orderBy?.createdAt ?? 'asc' },
      })
    },
  }),
)
