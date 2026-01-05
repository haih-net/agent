import { builder } from 'server/schema/builder'
import { FreeCodeTopicResponse } from '../index'
import { mapTopic } from '../utils'
import {
  FreeCodeTopicUpdateInput,
  FreeCodeTopicWhereUniqueInput,
} from '../inputs'
import type {
  UpdateTopicMutation,
  UpdateTopicMutationVariables,
  TopicUpdateInput,
  ResourceWhereUniqueInput,
} from 'server/externalApiClient/gql/generated'

builder.mutationField('updateFreeCodeTopic', (t) =>
  t.field({
    type: FreeCodeTopicResponse,
    args: {
      where: t.arg({ type: FreeCodeTopicWhereUniqueInput, required: true }),
      data: t.arg({ type: FreeCodeTopicUpdateInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { data, where } = args

      const { UpdateTopicDocument } =
        await import('server/externalApiClient/gql/generated')

      const updateInput: TopicUpdateInput = {}

      if (data.name !== undefined) {
        updateInput.name = data.name
      }
      if (data.longtitle !== undefined) {
        updateInput.longtitle = data.longtitle
      }
      if (data.intro !== undefined) {
        updateInput.intro = data.intro
      }
      if (data.contentV2 !== undefined) {
        updateInput.contentV2 = data.contentV2
      }

      const whereInput: ResourceWhereUniqueInput = {
        id: where.id,
      }

      const result = await ctx.externalApiQuery<
        UpdateTopicMutation,
        UpdateTopicMutationVariables
      >(
        UpdateTopicDocument,
        {
          where: whereInput,
          data: updateInput,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return {
        success: result.data?.updateTopicProcessor?.success ?? false,
        message: result.data?.updateTopicProcessor?.message ?? 'Unknown error',
        data: mapTopic(result.data?.updateTopicProcessor?.data ?? null),
      }
    },
  }),
)
