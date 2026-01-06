import { builder } from 'server/schema/builder'
import { FreeCodeMindLogResponse, FreeCodeMindLogCreateInput } from '../index'
import { MindLogType as GqlMindLogType } from 'server/externalApiClient/gql/generated'

builder.mutationField('createFreeCodeMindLog', (t) =>
  t.field({
    type: FreeCodeMindLogResponse,
    args: {
      data: t.arg({ type: FreeCodeMindLogCreateInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { data } = args

      const { CreateMindLogDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery(
        CreateMindLogDocument,
        {
          data: {
            type: data.type as GqlMindLogType,
            data: data.data,
            quality: data.quality,
          },
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
