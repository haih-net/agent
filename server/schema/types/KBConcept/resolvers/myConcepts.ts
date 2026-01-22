import { builder } from '../../../builder'
import { KBConceptOrderByInput, KBConceptWhereInput } from '../inputs'

builder.queryField('myConcepts', (t) =>
  t.prismaField({
    type: ['KBConcept'],
    args: {
      where: t.arg({ type: KBConceptWhereInput }),
      orderBy: t.arg({ type: KBConceptOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBConcept.findMany({
        ...query,
        where: {
          createdById: ctx.currentUser.id,
          type: args.where?.type ?? undefined,
          name: args.where?.name
            ? { contains: args.where.name, mode: 'insensitive' }
            : undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: args.orderBy?.createdAt ?? 'desc',
          name: args.orderBy?.name ?? undefined,
          type: args.orderBy?.type ?? undefined,
        },
      })
    },
  }),
)
