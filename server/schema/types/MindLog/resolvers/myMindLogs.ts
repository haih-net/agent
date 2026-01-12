import { builder } from '../../../builder'
import { MindLogWhereInput } from '../inputs'

builder.queryField('myMindLogs', (t) =>
  t.prismaField({
    type: ['MindLog'],
    args: {
      where: t.arg({ type: MindLogWhereInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        return []
      }

      const typeFilter = args.where?.type
      const typeCondition = typeFilter?.in
        ? { in: typeFilter.in }
        : typeFilter?.equals
          ? typeFilter.equals
          : undefined

      const relatedToUserId = args.where?.relatedToUserId

      const orConditions = []

      if (typeCondition) {
        orConditions.push({ type: typeCondition })
      }

      if (relatedToUserId) {
        orConditions.push({ relatedToUserId })
      }

      return ctx.prisma.mindLog.findMany({
        ...query,
        where: {
          createdById: ctx.currentUser.id,
          ...(orConditions.length > 0 ? { OR: orConditions } : {}),
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: { createdAt: 'desc' },
      })
    },
  }),
)
