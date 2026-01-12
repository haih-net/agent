import { TaskStatus } from '@prisma/client'
import { builder } from '../../../builder'
import { TaskOrderByInput, TaskWhereInput } from '../inputs'

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

      const completedStatuses = [TaskStatus.Done]
      const incompletedOnly = args.where?.incompletedOnly ?? true

      return ctx.prisma.task.findMany({
        ...query,
        where: {
          assigneeId: ctx.currentUser.id,
          status:
            args.where?.status ??
            (incompletedOnly ? { notIn: completedStatuses } : undefined),
          parentId: args.where?.parentId ?? undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: { createdAt: args.orderBy?.createdAt ?? 'asc' },
      })
    },
  }),
)
