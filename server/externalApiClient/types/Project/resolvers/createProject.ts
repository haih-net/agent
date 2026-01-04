import { builder } from 'server/schema/builder'
import { FreeCodeProjectResponse } from '../index'
import type {
  CreateProjectProcessorMutation,
  CreateProjectProcessorMutationVariables,
} from 'server/externalApiClient/gql/generated'

const FreeCodeProjectCreateInput = builder.inputType(
  'FreeCodeProjectCreateInput',
  {
    fields: (t) => ({
      name: t.string({ required: true }),
      url: t.string({ required: false }),
    }),
  },
)

builder.mutationField('createFreeCodeProject', (t) =>
  t.field({
    type: FreeCodeProjectResponse,
    args: {
      data: t.arg({ type: FreeCodeProjectCreateInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { data } = args

      const { CreateProjectProcessorDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery<
        CreateProjectProcessorMutation,
        CreateProjectProcessorMutationVariables
      >(
        CreateProjectProcessorDocument,
        {
          data: { name: data.name, url: data.url },
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
