import { builder } from 'server/schema/builder'
import { FreeCodeUser } from '../FreeCodeUser'

export const FreeCodeAuthResponse = builder.simpleObject(
  'FreeCodeAuthResponse',
  {
    fields: (t) => ({
      success: t.boolean(),
      message: t.string(),
      token: t.string({ nullable: true }),
      data: t.field({ type: FreeCodeUser, nullable: true }),
    }),
  },
)
