import { builder } from '../../../builder'
import { KBConstraintOrderByInput, KBConstraintWhereInput } from '../inputs'

builder.queryField('myConstraints', (t) =>
  t.prismaField({
    type: ['KBConstraint'],
    args: {
      where: t.arg({ type: KBConstraintWhereInput }),
      orderBy: t.arg({ type: KBConstraintOrderByInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Unauthorized')
      }

      return ctx.prisma.kBConstraint.findMany({
        ...query,
        where: {
          createdById: ctx.currentUser.id,
          constraint: args.where?.constraint
            ? { contains: args.where.constraint, mode: 'insensitive' }
            : undefined,
        },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: args.orderBy?.createdAt ?? 'desc',
        },
      })
    },
  }),
)
