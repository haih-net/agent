import { builder } from '../../../builder'
import { MindLogWhereUniqueInput, MindLogResponse } from '../inputs'

builder.mutationField('deleteMindLog', (t) =>
  t.field({
    type: MindLogResponse,
    args: {
      where: t.arg({ type: MindLogWhereUniqueInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.currentUser) {
        return {
          success: false,
          message: 'Not authenticated',
        }
      }

      if (!args.where.id) {
        throw new Error('MindLog id is empty')
      }

      try {
        const existing = await ctx.prisma.mindLog.findFirst({
          where: {
            id: args.where.id,
            createdById: ctx.currentUser.id,
          },
        })

        if (!existing) {
          return {
            success: false,
            message: 'MindLog not found',
          }
        }

        await ctx.prisma.mindLog.delete({
          where: { id: args.where.id },
        })

        return {
          success: true,
          message: 'MindLog deleted',
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
