import { builder } from '../../../builder'
import { PostWhereInput } from '../inputs'
import { buildPostWhere } from '../helpers/buildPostWhere'

builder.queryField('posts', (t) =>
  t.prismaField({
    type: ['Post'],
    args: {
      where: t.arg({ type: PostWhereInput }),
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: async (query, _root, args, ctx) => {
      return await ctx.prisma.post.findMany({
        ...query,
        where: buildPostWhere(args.where, ctx),
        orderBy: { createdAt: 'desc' },
        skip: args.skip ?? undefined,
        take: args.take ?? undefined,
      })
    },
  }),
)
