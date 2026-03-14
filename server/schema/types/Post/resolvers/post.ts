import { builder } from '../../../builder'
import { PostWhereUniqueInput } from '../inputs'

builder.queryField('post', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      where: t.arg({ type: PostWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const { id, ...other } = args.where

      return await ctx.prisma.post.findUnique({
        ...query,
        where: { id: id ?? undefined, ...other },
      })
    },
  }),
)
