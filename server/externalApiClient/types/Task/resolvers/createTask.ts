import { builder } from 'server/schema/builder'
import { FreeCodeTaskResponse, TaskStatus } from '../index'
import type {
  CreateTaskProcessorMutation,
  CreateTaskProcessorMutationVariables,
} from 'server/externalApiClient/gql/generated'
import { TaskStatus as GqlTaskStatus } from 'server/externalApiClient/gql/generated'

const FreeCodeTaskCreateInput = builder.inputType('FreeCodeTaskCreateInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string({ required: false }),
    content: t.string({ required: false }),
    projectId: t.string({ required: false }),
    status: t.field({ type: TaskStatus, required: false }),
  }),
})

builder.mutationField('createFreeCodeTask', (t) =>
  t.field({
    type: FreeCodeTaskResponse,
    args: {
      data: t.arg({ type: FreeCodeTaskCreateInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { data } = args

      const { CreateTaskProcessorDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery<
        CreateTaskProcessorMutation,
        CreateTaskProcessorMutationVariables
      >(
        CreateTaskProcessorDocument,
        {
          data: {
            name: data.name,
            description: data.description,
            content: data.content,
            status: data.status as GqlTaskStatus | null | undefined,
            Project: data.projectId
              ? { connect: { id: data.projectId } }
              : undefined,
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
