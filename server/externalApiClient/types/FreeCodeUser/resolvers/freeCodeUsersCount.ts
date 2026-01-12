import { builder } from 'server/schema/builder'
import type {
  UsersConnectionQuery,
  UsersConnectionQueryVariables,
} from 'src/gql/generated'
import { FreeCodeUserWhereInput } from '../inputs'

// TODO Refactor
builder.queryField('freeCodeUsersCount', (t) =>
  t.field({
    type: 'Int',
    args: {
      where: t.arg({ type: FreeCodeUserWhereInput, required: false }),
    },
    resolve: async (_root, args, ctx) => {
      const { where } = args

      const { UsersConnectionDocument } = await import('src/gql/generated')

      const result = await ctx.externalApiQuery<
        UsersConnectionQuery,
        UsersConnectionQueryVariables
      >(
        UsersConnectionDocument,
        {
          first: 1,
          where,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.usersCount ?? 0
    },
  }),
)
