import { builder } from '../../../builder'
import { AuthPayload, UserSignupDataInput } from '../inputs'
import { createToken, hashPassword } from '../helpers/auth'

builder.mutationField('signup', (t) =>
  t.field({
    type: AuthPayload,
    args: {
      data: t.arg({ type: UserSignupDataInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const password = args.data.password
      const email = args.data.email || undefined
      const username = args.data.username || undefined
      const fullname = args.data.fullname || undefined

      if (
        email &&
        (await ctx.prisma.user.findFirst({
          where: { email },
        }))
      ) {
        throw new Error('Email already registered')
      }

      if (
        username &&
        (await ctx.prisma.user.findFirst({
          where: { username },
        }))
      ) {
        throw new Error('Username already taken')
      }

      if (!password) {
        throw new Error('Password is required')
      }

      const hashedPassword = await hashPassword(password)

      const user = await ctx.prisma.user.create({
        data: {
          email,
          username,
          fullname,
          password: hashedPassword,
        },
      })

      const token = await createToken(user, ctx)

      return {
        success: true,
        message: null,
        token,
      }
    },
  }),
)
