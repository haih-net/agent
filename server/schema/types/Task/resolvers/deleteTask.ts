import { builder } from '../../../builder'
import { TaskWhereUniqueInput, TaskResponse } from '../inputs'

builder.mutationField('deleteTask', (t) =>
  t.field({
    type: TaskResponse,
    args: {
      where: t.arg({ type: TaskWhereUniqueInput, required: true }),
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

        await ctx.prisma.task.delete({
          where: { id: taskId },
        })

        return {
          success: true,
          message: 'Task deleted',
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
