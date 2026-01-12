import { builder } from '../../../builder'
import { TaskProgressCreateInput, TaskProgressResponse } from '../inputs'

builder.mutationField('createTaskProgress', (t) =>
  t.field({
    type: TaskProgressResponse,
    args: {
      data: t.arg({ type: TaskProgressCreateInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.currentUser) {
        return {
          success: false,
          message: 'Not authenticated',
        }
      }

      try {
        const task = await ctx.prisma.task.findFirst({
          where: {
            id: args.data.taskId,
            assigneeId: ctx.currentUser.id,
          },
        })

        if (!task) {
          return {
            success: false,
            message: 'Task not found',
          }
        }

        await ctx.prisma.taskProgress.create({
          data: {
            taskId: args.data.taskId,
            content: args.data.content,
            createdById: ctx.currentUser.id,
          },
        })

        return {
          success: true,
          message: 'TaskProgress created',
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
