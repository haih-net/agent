import { builder } from '../../../builder'
import { TaskWorkLogWhereUniqueInput } from '../inputs'

builder.queryField('taskWorkLog', (t) =>
  t.prismaField({
    type: 'TaskWorkLog',
    nullable: true,
    args: {
      where: t.arg({ type: TaskWorkLogWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        return null
      }

      return ctx.prisma.taskWorkLog.findFirst({
        ...query,
        where: {
          id: args.where.id,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
