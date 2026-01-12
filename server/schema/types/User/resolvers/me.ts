import { builder } from '../../../builder'

builder.queryField('me', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    resolve: (_query, _root, _args, ctx) => {
      return ctx.currentUser
    },
  }),
)
