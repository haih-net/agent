import { builder } from '../../../builder'
import { UserWhereInput } from '../inputs'

builder.queryField('usersCount', (t) =>
  t.int({
    args: {
      where: t.arg({ type: UserWhereInput }),
    },
    resolve: (_root, args, ctx) =>
      ctx.prisma.user.count({
        where: args.where
          ? {
              id: args.where.id ?? undefined,
              email: args.where.email ?? undefined,
              username: args.where.username ?? undefined,
            }
          : undefined,
      }),
  }),
)
