import { builder } from '../../../builder'
import { KBFactOrderByInput, KBFactWhereInput } from '../inputs'

builder.queryField('myFacts', (t) =>
  t.prismaField({
    type: ['KBFact'],
    args: {
      where: t.arg({ type: KBFactWhereInput }),
      orderBy: t.arg({ type: KBFactOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBFact.findMany({
        ...query,
        where: {
          createdById: ctx.currentUser.id,
          type: args.where?.type ?? undefined,
          status: args.where?.status ?? undefined,
          confidence: args.where?.confidence ?? undefined,
          importance: args.where?.importance ?? undefined,
          validFrom: args.where?.validFrom ?? undefined,
          validTo: args.where?.validTo ?? undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: args.orderBy?.createdAt ?? 'desc',
          validFrom: args.orderBy?.validFrom ?? undefined,
          confidence: args.orderBy?.confidence ?? undefined,
          importance: args.orderBy?.importance ?? undefined,
        },
      })
    },
  }),
)
