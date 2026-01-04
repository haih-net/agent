import { builder } from 'server/schema/builder'
import { FreeCodeTaskResponse, TaskStatus } from '../index'
import type {
  UpdateTaskProcessorMutation,
  UpdateTaskProcessorMutationVariables,
} from 'server/externalApiClient/gql/generated'
import { TaskStatus as GqlTaskStatus } from 'server/externalApiClient/gql/generated'

const FreeCodeTaskUpdateInput = builder.inputType('FreeCodeTaskUpdateInput', {
  fields: (t) => ({
    name: t.string({ required: false }),
    description: t.string({ required: false }),
    content: t.string({ required: false }),
    status: t.field({ type: TaskStatus, required: false }),
  }),
})

const FreeCodeTaskUpdateWhereInput = builder.inputType(
  'FreeCodeTaskUpdateWhereInput',
  {
    fields: (t) => ({
      id: t.string({ required: true }),
    }),
  },
)

builder.mutationField('updateFreeCodeTask', (t) =>
  t.field({
    type: FreeCodeTaskResponse,
    args: {
      data: t.arg({ type: FreeCodeTaskUpdateInput, required: true }),
      where: t.arg({ type: FreeCodeTaskUpdateWhereInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { data, where } = args

      const { UpdateTaskProcessorDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery<
        UpdateTaskProcessorMutation,
        UpdateTaskProcessorMutationVariables
      >(
        UpdateTaskProcessorDocument,
        {
          where: { id: where.id },
          data: {
            name: data.name,
            description: data.description,
            content: data.content,
            status: data.status as GqlTaskStatus | null | undefined,
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
