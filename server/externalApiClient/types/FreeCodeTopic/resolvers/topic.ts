import { builder } from 'server/schema/builder'
import { FreeCodeTopic } from '../index'
import { mapTopic } from '../utils'
import { FreeCodeTopicWhereUniqueInput } from '../inputs'
import type {
  TopicQuery,
  TopicQueryVariables,
  ResourceWhereUniqueInput,
} from 'server/externalApiClient/gql/generated'

builder.queryField('freeCodeTopic', (t) =>
  t.field({
    type: FreeCodeTopic,
    nullable: true,
    args: {
      where: t.arg({ type: FreeCodeTopicWhereUniqueInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { where } = args

      const { TopicDocument } =
        await import('server/externalApiClient/gql/generated')

      const whereInput: ResourceWhereUniqueInput = {
        id: where.id,
      }

      const result = await ctx.externalApiQuery<
        TopicQuery,
        TopicQueryVariables
      >(
        TopicDocument,
        {
          where: whereInput,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return mapTopic(result.data?.resource ?? null)
    },
  }),
)
