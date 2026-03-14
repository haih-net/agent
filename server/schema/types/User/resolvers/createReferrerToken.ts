import { builder } from '../../../builder'
import jwt, { SignOptions } from 'jsonwebtoken'
import { REFERRER_TOKEN_TTL, ReferrerTokenPayload } from '../interfaces'
import { JWT_SECRET, JWT_TYPE_REFERRER } from 'server/helpers/jwt'

builder.mutationField('createReferrerToken', (t) =>
  t.string({
    nullable: false,
    resolve: async (_root, _args, ctx) => {
      if (!ctx.currentUser) {
        throw new Error('Not authenticated')
      }

      const payload: ReferrerTokenPayload = {
        userId: ctx.currentUser.id,
        type: JWT_TYPE_REFERRER,
      }

      const options: SignOptions = {
        expiresIn: REFERRER_TOKEN_TTL,
        algorithm: 'HS256',
      }

      return jwt.sign(payload, JWT_SECRET, options)
    },
  }),
)
