import { builder } from '../../../builder'
import { AuthPayload, UserSignupDataInput } from '../inputs'
import { createToken, hashPassword } from '../helpers/auth'
import { UserStatus } from '@prisma/client'
import jwt from 'jsonwebtoken'
import {
  ReferrerTokenPayload,
  signupStrategy,
  SignupStrategy,
} from '../interfaces'
import { JWT_SECRET, JWT_TYPE_REFERRER } from '../../../../helpers/jwt'

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
      const referrerToken = args.data.referrerToken

      let referrerId: string | undefined

      if (referrerToken) {
        const decoded = jwt.verify(
          referrerToken,
          JWT_SECRET,
        ) as Partial<ReferrerTokenPayload>

        if (decoded.type !== JWT_TYPE_REFERRER) {
          throw new Error('Invalid token type')
        }

        referrerId = decoded.userId

        if (!referrerId) {
          throw new Error('Referrer not found')
        }
      } else {
        if (signupStrategy !== SignupStrategy.ANY) {
          throw new Error('Referrer token required')
        }
      }

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

      let status: UserStatus

      const defaultStatus = process.env.USER_DEFAULT_STATUS as
        | undefined
        | keyof typeof UserStatus

      if (defaultStatus) {
        if (Object.values(UserStatus).includes(defaultStatus)) {
          status = defaultStatus
        } else {
          throw new Error('defaultStatus value is not match UserStatus enum')
        }
      } else {
        status = UserStatus.active
      }

      const user = await ctx.prisma.user.create({
        data: {
          email,
          username,
          fullname,
          password: hashedPassword,
          status,
          referrerId,
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
