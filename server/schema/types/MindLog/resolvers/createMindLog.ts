import { builder } from '../../../builder'
import { MindLogCreateInput } from '../inputs'

builder.mutationField('createMindLog', (t) =>
  t.prismaField({
    type: 'MindLog',
    args: {
      data: t.arg({ type: MindLogCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Not authenticated')
      }

      return ctx.prisma.mindLog.create({
        ...query,
        data: {
          type: args.data.type,
          data: args.data.data,
          quality: args.data.quality ?? undefined,
          createdById: ctx.currentUser.id,
          relatedToUserId: args.data.relatedToUserId ?? undefined,
        },
      })
    },
  }),
)
