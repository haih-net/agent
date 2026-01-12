import { builder } from '../../../builder'
import { TaskProgressWhereInput } from '../inputs'

builder.queryField('taskProgressList', (t) =>
  t.prismaField({
    type: ['TaskProgress'],
    args: {
      where: t.arg({ type: TaskProgressWhereInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        return []
      }

      return ctx.prisma.taskProgress.findMany({
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
