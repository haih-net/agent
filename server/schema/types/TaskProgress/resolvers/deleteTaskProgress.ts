import { builder } from '../../../builder'
import { TaskProgressWhereUniqueInput, TaskProgressResponse } from '../inputs'

builder.mutationField('deleteTaskProgress', (t) =>
  t.field({
    type: TaskProgressResponse,
    args: {
      where: t.arg({ type: TaskProgressWhereUniqueInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.currentUser) {
        return {
          success: false,
          message: 'Not authenticated',
        }
      }

      try {
        const existing = await ctx.prisma.taskProgress.findFirst({
          where: {
            id: args.where.id,
            createdById: ctx.currentUser.id,
          },
        })

        if (!existing) {
          return {
            success: false,
            message: 'TaskProgress not found',
          }
        }

        await ctx.prisma.taskProgress.delete({
          where: { id: args.where.id },
        })

        return {
          success: true,
          message: 'TaskProgress deleted',
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
