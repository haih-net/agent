import { builder } from '../../../builder'
import { MindLogWhereUniqueInput, MindLogUpdateInput } from '../inputs'

builder.mutationField('updateMindLog', (t) =>
  t.prismaField({
    type: 'MindLog',
    args: {
      where: t.arg({ type: MindLogWhereUniqueInput, required: true }),
      data: t.arg({ type: MindLogUpdateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Not authenticated')
      }

      if (!args.where.id) {
        throw new Error('MindLog id is empty')
      }

      const existing = await ctx.prisma.mindLog.findFirst({
        where: {
          id: args.where.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existing) {
        throw new Error('MindLog not found')
      }

      return ctx.prisma.mindLog.update({
        ...query,
        where: { id: args.where.id },
        data: {
          data: args.data.data ?? undefined,
          quality: args.data.quality ?? undefined,
        },
      })
    },
  }),
)
