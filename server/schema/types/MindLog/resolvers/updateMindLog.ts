import { builder } from '../../../builder'
import {
  MindLogWhereUniqueInput,
  MindLogUpdateInput,
  MindLogResponse,
} from '../inputs'

builder.mutationField('updateMindLog', (t) =>
  t.field({
    type: MindLogResponse,
    args: {
      where: t.arg({ type: MindLogWhereUniqueInput, required: true }),
      data: t.arg({ type: MindLogUpdateInput, required: true }),
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

        await ctx.prisma.mindLog.update({
          where: { id: args.where.id },
          data: {
            data: args.data.data ?? undefined,
            quality: args.data.quality ?? undefined,
          },
        })

        return {
          success: true,
          message: 'MindLog updated',
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
