import { builder } from '../../../builder'
import { TaskCreateInput } from '../inputs'

builder.mutationField('createTask', (t) =>
  t.prismaField({
    type: 'Task',
    args: {
      data: t.arg({ type: TaskCreateInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Not authenticated')
      }

      return ctx.prisma.task.create({
        ...query,
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
    },
  }),
)
