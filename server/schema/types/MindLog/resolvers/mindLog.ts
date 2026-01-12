import { builder } from '../../../builder'
import { MindLogWhereUniqueInput } from '../inputs'

builder.queryField('mindLog', (t) =>
  t.prismaField({
    type: 'MindLog',
    nullable: true,
    args: {
      where: t.arg({ type: MindLogWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const mindLogId = args.where.id
      if (!mindLogId) {
        throw new Error('MindLog ID is required')
      }

      return ctx.prisma.mindLog.findUnique({
        ...query,
        where: {
          id: mindLogId,
        },
      })
    },
  }),
)
