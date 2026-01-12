import { builder } from 'server/schema/builder'
import { FreeCodeTopicResponse } from '../index'
import { mapTopic } from '../utils'
import { FreeCodeTopicCreateInput } from '../inputs'
import type {
  CreateTopicMutation,
  CreateTopicMutationVariables,
  TopicCreateInput,
} from 'server/externalApiClient/gql/generated'

builder.mutationField('createFreeCodeTopic', (t) =>
  t.field({
    type: FreeCodeTopicResponse,
    args: {
      data: t.arg({ type: FreeCodeTopicCreateInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { data } = args

      const { CreateTopicDocument } =
        await import('server/externalApiClient/gql/generated')

      const createInput: TopicCreateInput = {
        name: data.name,
        longtitle: data.longtitle || undefined,
        intro: data.intro || undefined,
        contentV2: data.contentV2 || undefined,
        blogID: data.blogID || undefined,
      }

      const result = await ctx.externalApiQuery<
        CreateTopicMutation,
        CreateTopicMutationVariables
      >(
        CreateTopicDocument,
        {
          data: createInput,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return {
        success: result.data?.createTopicProcessor?.success ?? false,
        message: result.data?.createTopicProcessor?.message ?? 'Unknown error',
        data: mapTopic(result.data?.createTopicProcessor?.data ?? null),
      }
    },
  }),
)
