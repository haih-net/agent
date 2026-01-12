import { builder } from '../../../builder'
import {
  AuthPayload,
  UserWhereUniqueInput,
  UserSigninDataInput,
} from '../inputs'
import { createToken, comparePassword } from '../helpers/auth'

builder.mutationField('signin', (t) =>
  t.field({
    type: AuthPayload,
    args: {
      where: t.arg({ type: UserWhereUniqueInput, required: true }),
      data: t.arg({ type: UserSigninDataInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { where, data } = args
      const { password } = data

      if (!where.email && !where.username && !where.id) {
        return {
          success: false,
          message: 'Email, username or id required',
          token: null,
        }
      }

      const user = await ctx.prisma.user.findFirst({
        where: {
          id: where.id ?? undefined,
          email: where.email ?? undefined,
          username: where.username ?? undefined,
        },
      })

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          token: null,
        }
      }

      if (!user.password) {
        return {
          success: false,
          message: 'Password not set',
          token: null,
        }
      }

      const valid = await comparePassword(password, user.password)

      if (!valid) {
        return {
          success: false,
          message: 'Invalid password',
          token: null,
        }
      }

      const token = await createToken(user, ctx)

      return {
        success: true,
        message: null,
        token,
      }
    },
  }),
)
