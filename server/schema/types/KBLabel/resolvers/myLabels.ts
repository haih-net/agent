import { builder } from '../../../builder'
import { KBLabelOrderByInput, KBLabelWhereInput } from '../inputs'

builder.queryField('myLabels', (t) =>
  t.prismaField({
    type: ['KBLabel'],
    args: {
      where: t.arg({ type: KBLabelWhereInput }),
      orderBy: t.arg({ type: KBLabelOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBLabel.findMany({
        ...query,
        where: {
          createdById: ctx.currentUser.id,
          conceptId: args.where?.conceptId ?? undefined,
          role: args.where?.role ?? undefined,
          language: args.where?.language ?? undefined,
          text: args.where?.text
            ? { contains: args.where.text, mode: 'insensitive' }
            : undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: args.orderBy?.createdAt ?? 'desc',
          text: args.orderBy?.text ?? undefined,
          language: args.orderBy?.language ?? undefined,
        },
      })
    },
  }),
)
