import { builder } from 'server/schema/builder'
import {
  FreeCodeMindLogResponse,
  FreeCodeMindLogWhereUniqueInput,
} from '../index'

builder.mutationField('deleteFreeCodeMindLog', (t) =>
  t.field({
    type: FreeCodeMindLogResponse,
    args: {
      where: t.arg({ type: FreeCodeMindLogWhereUniqueInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { where } = args

      const { DeleteMindLogDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery(
        DeleteMindLogDocument,
        { where: { id: where.id } },
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
