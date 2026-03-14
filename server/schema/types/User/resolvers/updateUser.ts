import { builder } from '../../../builder'
import { UserUpdateDataInput, UserWhereUniqueInput } from '../inputs'

builder.mutationField('updateUser', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    args: {
      data: t.arg({ type: UserUpdateDataInput, required: true }),
      where: t.arg({ type: UserWhereUniqueInput, required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const { currentUser } = ctx

      if (!currentUser?.sudo) {
        throw new Error('Access denied')
      }

      const { status, ...other } = args.data
      const { id: userId } = args.where

      if (!userId) {
        throw new Error('id did not provided')
      }

      if (currentUser.id === userId) {
        throw new Error('Can not update self account via this method')
      }

      return ctx.prisma.user.update({
        ...query,
        data: {
          ...other,
          status: status ?? undefined,
        },
        where: {
          id: userId,
        },
      })
    },
  }),
)
