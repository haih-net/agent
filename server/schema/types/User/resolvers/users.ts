import { builder } from '../../../builder'
import { UserWhereInput } from '../inputs'

builder.queryField('users', (t) =>
  t.prismaField({
    type: ['User'],
    args: {
      where: t.arg({ type: UserWhereInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: (query, _root, args, ctx) =>
      ctx.prisma.user.findMany({
        ...query,
        where: args.where
          ? {
              id: args.where.id ?? undefined,
              email: args.where.email ?? undefined,
              username: args.where.username ?? undefined,
            }
          : undefined,
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
      }),
  }),
)
