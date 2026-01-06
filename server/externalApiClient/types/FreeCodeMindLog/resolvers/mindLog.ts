import { builder } from 'server/schema/builder'
import { FreeCodeMindLog, FreeCodeMindLogWhereUniqueInput } from '../index'

builder.queryField('freeCodeMindLog', (t) =>
  t.field({
    type: FreeCodeMindLog,
    nullable: true,
    args: {
      where: t.arg({ type: FreeCodeMindLogWhereUniqueInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { where } = args

      const { MindLogDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery(
        MindLogDocument,
        { where: { id: where.id } },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.mindLog ?? null
    },
  }),
)
