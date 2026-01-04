import { builder } from 'server/schema/builder'
import { FreeCodeUser } from '../index'
import type {
  MeUserQuery,
  MeUserQueryVariables,
} from 'server/externalApiClient/gql/generated'

builder.queryField('freeCodeMe', (t) =>
  t.field({
    type: FreeCodeUser,
    nullable: true,
    resolve: async (_root, _args, ctx) => {
      const { MeUserDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery<
        MeUserQuery,
        MeUserQueryVariables
      >(MeUserDocument, {}, ctx)

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.me ?? null
    },
  }),
)
