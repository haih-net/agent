import { builder } from '../../../builder'
import { TaskWorkLogWhereUniqueInput } from '../inputs'

builder.mutationField('deleteTaskWorkLog', (t) =>
  t.prismaField({
    type: 'TaskWorkLog',
    args: {
      where: t.arg({ type: TaskWorkLogWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Not authenticated')
      }

      const existing = await ctx.prisma.taskWorkLog.findFirst({
        where: {
          id: args.where.id,
          createdById: ctx.currentUser.id,
        },
      })

      if (!existing) {
        throw new Error('TaskWorkLog not found')
      }

      return ctx.prisma.taskWorkLog.delete({
        ...query,
        where: { id: args.where.id },
      })
    },
  }),
)
