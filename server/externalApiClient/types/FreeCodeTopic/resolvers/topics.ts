import { builder } from 'server/schema/builder'
import { FreeCodeTopic } from '../index'
import { mapTopic } from '../utils'
import { FreeCodeTopicWhereInput } from '../inputs'
import type {
  TopicsQuery,
  TopicsQueryVariables,
  TopicsCountQuery,
  TopicsCountQueryVariables,
  ResourceWhereInput,
} from 'server/externalApiClient/gql/generated'
import { ResourceType as ExternalResourceType } from 'server/externalApiClient/gql/generated'

builder.queryField('freeCodeTopics', (t) =>
  t.field({
    type: [FreeCodeTopic],
    args: {
      where: t.arg({ type: FreeCodeTopicWhereInput, required: false }),
      take: t.arg.int({ defaultValue: 10 }),
      skip: t.arg.int({ required: false }),
    },
    resolve: async (_root, args, ctx) => {
      const { take, skip, where: whereArg } = args

      const { TopicsDocument } =
        await import('server/externalApiClient/gql/generated')

      const where: ResourceWhereInput = {
        type: { equals: ExternalResourceType.TOPIC },
        ...(whereArg?.id && { id: { equals: whereArg.id } }),
        ...(whereArg?.name && { name: { contains: whereArg.name } }),
        ...(whereArg?.published !== undefined && {
          published: { equals: whereArg.published },
        }),
        ...(whereArg?.deleted !== undefined && {
          deleted: { equals: whereArg.deleted },
        }),
        ...(whereArg?.createdBy && {
          CreatedBy: { equals: whereArg.createdBy },
        }),
      }

      const result = await ctx.externalApiQuery<
        TopicsQuery,
        TopicsQueryVariables
      >(
        TopicsDocument,
        {
          take,
          skip,
          where,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      const topics = result.data?.resources ?? []
      return topics
        .map(mapTopic)
        .filter((r): r is NonNullable<typeof r> => r !== null)
    },
  }),
)

builder.queryField('freeCodeTopicsCount', (t) =>
  t.field({
    type: 'Int',
    args: {
      where: t.arg({ type: FreeCodeTopicWhereInput, required: false }),
    },
    resolve: async (_root, args, ctx) => {
      const { where: whereArg } = args

      const { TopicsCountDocument } =
        await import('server/externalApiClient/gql/generated')

      const where: ResourceWhereInput = {
        type: { equals: ExternalResourceType.TOPIC },
        ...(whereArg?.id && { id: { equals: whereArg.id } }),
        ...(whereArg?.name && { name: { contains: whereArg.name } }),
        ...(whereArg?.published !== undefined && {
          published: { equals: whereArg.published },
        }),
        ...(whereArg?.deleted !== undefined && {
          deleted: { equals: whereArg.deleted },
        }),
        ...(whereArg?.createdBy && {
          CreatedBy: { equals: whereArg.createdBy },
        }),
      }

      const result = await ctx.externalApiQuery<
        TopicsCountQuery,
        TopicsCountQueryVariables
      >(
        TopicsCountDocument,
        {
          where,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.resourcesCount ?? 0
    },
  }),
)
