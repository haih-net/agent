import { builder } from 'server/schema/builder'
import { FreeCodeUser } from '../index'
import type {
  UsersConnectionQuery,
  UsersConnectionQueryVariables,
} from 'src/gql/generated'

builder.queryField('freeCodeUsers', (t) =>
  t.field({
    type: [FreeCodeUser],
    args: {
      take: t.arg.int({ defaultValue: 10 }),
    },
    resolve: async (_root, args, ctx) => {
      const { take } = args

      const { UsersConnectionDocument } = await import('src/gql/generated')

      const result = await ctx.externalApiQuery<
        UsersConnectionQuery,
        UsersConnectionQueryVariables
      >(
        UsersConnectionDocument,
        {
          first: take,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.users
    },
  }),
)
