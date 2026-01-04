import { builder } from 'server/schema/builder'
import { FreeCodeUser } from '../index'
import type {
  UserQuery,
  UserQueryVariables,
} from 'server/externalApiClient/gql/generated'
import { FreeCodeUserWhereUniqueInput } from '../inputs'

builder.queryField('freeCodeUser', (t) =>
  t.field({
    type: FreeCodeUser,
    args: {
      where: t.arg({ type: FreeCodeUserWhereUniqueInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { where } = args

      const { UserDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery<UserQuery, UserQueryVariables>(
        UserDocument,
        {
          where,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.object
    },
  }),
)
