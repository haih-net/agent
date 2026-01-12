import { builder } from '../../../builder'
import { TaskCreateInput, TaskResponse } from '../inputs'

builder.mutationField('createTask', (t) =>
  t.field({
    type: TaskResponse,
    args: {
      data: t.arg({ type: TaskCreateInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.currentUser) {
        return {
          success: false,
          message: 'Not authenticated',
        }
      }

      try {
        await ctx.prisma.task.create({
          data: {
            title: args.data.title,
            description: args.data.description ?? undefined,
            content: args.data.content ?? undefined,
            startDatePlaning: args.data.startDatePlaning ?? undefined,
            endDatePlaning: args.data.endDatePlaning ?? undefined,
            parentId: args.data.parentId ?? undefined,
            createdById: ctx.currentUser.id,
            assigneeId: ctx.currentUser.id,
          },
        })

        return {
          success: true,
          message: 'Task created',
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
