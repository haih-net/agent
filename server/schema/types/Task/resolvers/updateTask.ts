import { builder } from '../../../builder'
import { TaskWhereUniqueInput, TaskUpdateInput } from '../inputs'

builder.mutationField('updateTask', (t) =>
  t.prismaField({
    type: 'Task',
    args: {
      where: t.arg({ type: TaskWhereUniqueInput, required: true }),
      data: t.arg({ type: TaskUpdateInput, required: true }),
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

      return ctx.prisma.task.update({
        ...query,
        where: { id: taskId },
        data: {
          title: args.data.title ?? undefined,
          description: args.data.description ?? undefined,
          content: args.data.content ?? undefined,
          status: args.data.status ?? undefined,
          startDatePlaning: args.data.startDatePlaning ?? undefined,
          endDatePlaning: args.data.endDatePlaning ?? undefined,
          startDate: args.data.startDate ?? undefined,
          endDate: args.data.endDate ?? undefined,
        },
      })
    },
  }),
)
