import { builder } from '../../../builder'
import { UserWhereInput } from '../inputs'
import { buildUserWhere } from '../helpers/buildUserWhere'

builder.queryField('users', (t) =>
  t.prismaField({
    type: ['User'],
    args: {
      where: t.arg({ type: UserWhereInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: (_, _root, args, ctx) =>
      ctx.prisma.user.findMany({
        where: buildUserWhere(args.where, ctx),
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
        orderBy: {
          createdAt: 'desc',
        },
      }),
  }),
)
