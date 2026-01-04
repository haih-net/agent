import { builder } from 'server/schema/builder'
import { FreeCodeProjectResponse, ProjectStatus } from '../index'
import type {
  UpdateProjectProcessorMutation,
  UpdateProjectProcessorMutationVariables,
} from 'server/externalApiClient/gql/generated'
import { ProjectStatus as GqlProjectStatus } from 'server/externalApiClient/gql/generated'

const FreeCodeProjectUpdateInput = builder.inputType(
  'FreeCodeProjectUpdateInput',
  {
    fields: (t) => ({
      name: t.string({ required: false }),
      description: t.string({ required: false }),
      url: t.string({ required: false }),
      status: t.field({ type: ProjectStatus, required: false }),
    }),
  },
)

const FreeCodeProjectUpdateWhereInput = builder.inputType(
  'FreeCodeProjectUpdateWhereInput',
  {
    fields: (t) => ({
      id: t.string({ required: true }),
    }),
  },
)

builder.mutationField('updateFreeCodeProject', (t) =>
  t.field({
    type: FreeCodeProjectResponse,
    args: {
      data: t.arg({ type: FreeCodeProjectUpdateInput, required: true }),
      where: t.arg({ type: FreeCodeProjectUpdateWhereInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { data, where } = args

      const { UpdateProjectProcessorDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery<
        UpdateProjectProcessorMutation,
        UpdateProjectProcessorMutationVariables
      >(
        UpdateProjectProcessorDocument,
        {
          where: { id: where.id },
          data: {
            name: data.name,
            description: data.description,
            url: data.url,
            status: data.status as GqlProjectStatus | null | undefined,
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
