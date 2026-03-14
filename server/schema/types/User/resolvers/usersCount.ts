import { builder } from '../../../builder'
import { buildUserWhere } from '../helpers/buildUserWhere'
import { UserWhereInput } from '../inputs'

builder.queryField('usersCount', (t) =>
  t.int({
    args: {
      where: t.arg({ type: UserWhereInput }),
    },
    resolve: (_root, args, ctx) =>
      ctx.prisma.user.count({
        where: buildUserWhere(args.where, ctx),
      }),
  }),
)
