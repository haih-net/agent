import { builder } from 'server/schema/builder'
import { FreeCodeTimer } from '../index'
import type {
  TimerQuery,
  TimerQueryVariables,
} from 'server/externalApiClient/gql/generated'

builder.queryField('freeCodeTimer', (t) =>
  t.field({
    type: FreeCodeTimer,
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { TimerDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery<
        TimerQuery,
        TimerQueryVariables
      >(
        TimerDocument,
        {
          where: { id: args.id },
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.timer ?? null
    },
  }),
)
