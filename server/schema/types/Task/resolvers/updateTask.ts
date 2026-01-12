import { builder } from '../../../builder'
import { TaskWhereUniqueInput, TaskUpdateInput, TaskResponse } from '../inputs'

builder.mutationField('updateTask', (t) =>
  t.field({
    type: TaskResponse,
    args: {
      where: t.arg({ type: TaskWhereUniqueInput, required: true }),
      data: t.arg({ type: TaskUpdateInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.currentUser) {
        return {
          success: false,
          message: 'Not authenticated',
        }
      }

      const taskId = args.where.id
      if (!taskId) {
        throw new Error('Task ID is required')
      }

      try {
        const existing = await ctx.prisma.task.findFirst({
          where: {
            id: taskId,
            assigneeId: ctx.currentUser.id,
          },
        })

        if (!existing) {
          return {
            success: false,
            message: 'Task not found',
          }
        }

        await ctx.prisma.task.update({
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

        return {
          success: true,
          message: 'Task updated',
        }
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },
  }),
)
