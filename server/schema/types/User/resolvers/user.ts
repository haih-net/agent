import { builder } from '../../../builder'
import { UserWhereUniqueInput } from '../inputs'

builder.queryField('user', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    args: {
      where: t.arg({ type: UserWhereUniqueInput, required: true }),
    },
    resolve: (query, _root, args, ctx) =>
      ctx.prisma.user.findFirst({
        ...query,
        where: {
          id: args.where.id ?? undefined,
          email: args.where.email ?? undefined,
          username: args.where.username ?? undefined,
        },
      }),
  }),
)
