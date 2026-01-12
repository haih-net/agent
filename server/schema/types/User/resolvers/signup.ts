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
      const { email, password, username, fullname } = args.data

      const existing = await ctx.prisma.user.findFirst({
        where: {
          OR: [{ email }, ...(username ? [{ username }] : [])],
        },
      })

      if (existing) {
        return {
          success: false,
          message:
            existing.email === email
              ? 'Email already registered'
              : 'Username already taken',
          token: null,
        }
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
