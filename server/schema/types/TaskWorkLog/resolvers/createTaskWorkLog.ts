import { builder } from '../../../builder'
import { TaskWorkLogCreateInput } from '../inputs'

builder.mutationField('createTaskWorkLog', (t) =>
  t.prismaField({
    type: 'TaskWorkLog',
    args: {
      data: t.arg({ type: TaskWorkLogCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Not authenticated')
      }

      const task = await ctx.prisma.task.findFirst({
        where: {
          id: args.data.taskId,
          assigneeId: ctx.currentUser.id,
        },
      })

      if (!task) {
        throw new Error('Task not found')
      }

      return ctx.prisma.taskWorkLog.create({
        ...query,
        data: {
          taskId: args.data.taskId,
          content: args.data.content,
          createdById: ctx.currentUser.id,
        },
      })
    },
  }),
)
