import { builder } from '../../../builder'
import { TaskProgressWhereUniqueInput } from '../inputs'

builder.queryField('taskProgress', (t) =>
  t.prismaField({
    type: 'TaskProgress',
    nullable: true,
    args: {
      where: t.arg({ type: TaskProgressWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        return null
      }

      return ctx.prisma.taskProgress.findFirst({
        ...query,
        where: {
          id: args.where.id,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
