import { builder } from 'server/schema/builder'
import {
  FreeCodeMindLogResponse,
  FreeCodeMindLogWhereUniqueInput,
  FreeCodeMindLogUpdateInput,
} from '../index'

builder.mutationField('updateFreeCodeMindLog', (t) =>
  t.field({
    type: FreeCodeMindLogResponse,
    args: {
      where: t.arg({ type: FreeCodeMindLogWhereUniqueInput, required: true }),
      data: t.arg({ type: FreeCodeMindLogUpdateInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { where, data } = args

      const { UpdateMindLogDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery(
        UpdateMindLogDocument,
        {
          where: { id: where.id },
          data: { data: data.data, quality: data.quality },
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return (
        result.data?.response ?? {
          success: false,
          message: 'No response',
          data: null,
        }
      )
    },
  }),
)
