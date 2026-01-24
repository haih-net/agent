import { builder } from '../../../builder'
import { TaskOrderByInput, TaskWhereInput } from '../inputs'
import { buildTaskWhere } from '../helpers'

builder.queryField('myTasks', (t) =>
  t.prismaField({
    type: ['Task'],
    args: {
      where: t.arg({ type: TaskWhereInput }),
      orderBy: t.arg({ type: TaskOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.task.findMany({
        ...query,
        where: buildTaskWhere(args.where, { myOnly: true }, ctx),
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: { createdAt: args.orderBy?.createdAt ?? 'asc' },
      })
    },
  }),
)
