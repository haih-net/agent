import { builder } from '../../../builder'
import { MindLogCreateInput, MindLogResponse } from '../inputs'

builder.mutationField('createMindLog', (t) =>
  t.field({
    type: MindLogResponse,
    args: {
      data: t.arg({ type: MindLogCreateInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      if (!ctx.currentUser) {
        return {
          success: false,
          message: 'Not authenticated',
        }
      }

      try {
        await ctx.prisma.mindLog.create({
          data: {
            type: args.data.type,
            data: args.data.data,
            quality: args.data.quality ?? undefined,
            createdById: ctx.currentUser.id,
            relatedToUserId: args.data.relatedToUserId ?? undefined,
          },
        })

        return {
          success: true,
          message: 'MindLog created',
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
