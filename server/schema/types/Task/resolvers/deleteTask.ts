import { builder } from '../../../builder'
import { TaskWhereUniqueInput } from '../inputs'

builder.mutationField('deleteTask', (t) =>
  t.prismaField({
    type: 'Task',
    args: {
      where: t.arg({ type: TaskWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Not authenticated')
      }

      const taskId = args.where.id
      if (!taskId) {
        throw new Error('Task ID is required')
      }

      const existing = await ctx.prisma.task.findFirst({
        where: {
          id: taskId,
          assigneeId: ctx.currentUser.id,
        },
      })

      if (!existing) {
        throw new Error('Task not found')
      }

      return ctx.prisma.task.delete({
        ...query,
        where: { id: taskId },
      })
    },
  }),
)
