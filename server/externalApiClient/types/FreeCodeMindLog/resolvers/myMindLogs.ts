import { builder } from 'server/schema/builder'
import { FreeCodeMindLog, MindLogType } from '../index'
import { FreeCodeSortOrder } from 'server/externalApiClient/types/FreeCodeProject/resolvers/projects'

const FreeCodeMindLogOrderByInput = builder.inputType(
  'FreeCodeMindLogOrderByInput',
  {
    fields: (t) => ({
      createdAt: t.field({ type: FreeCodeSortOrder, required: false }),
      updatedAt: t.field({ type: FreeCodeSortOrder, required: false }),
    }),
  },
)

const FreeCodeMindLogWhereInput = builder.inputType(
  'FreeCodeMindLogWhereInput',
  {
    fields: (t) => ({
      type: t.field({ type: MindLogType, required: false }),
      relatedToUserId: t.string({ required: false }),
    }),
  },
)

builder.queryField('freeCodeMyMindLogs', (t) =>
  t.field({
    type: [FreeCodeMindLog],
    args: {
      where: t.arg({ type: FreeCodeMindLogWhereInput, required: false }),
      orderBy: t.arg({ type: FreeCodeMindLogOrderByInput, required: false }),
      take: t.arg.int({ defaultValue: 50 }),
      skip: t.arg.int({ required: false }),
    },
    resolve: async (_root, args, ctx) => {
      const { take, skip, where: whereArg, orderBy: orderByArg } = args

      const { MyMindLogsDocument } =
        await import('server/externalApiClient/gql/generated')

      const where: Record<string, unknown> = {}
      if (whereArg?.type) {
        where.type = { equals: whereArg.type }
      }
      if (whereArg?.relatedToUserId) {
        where.relatedToUserId = { equals: whereArg.relatedToUserId }
      }

      const orderBy: Record<string, unknown> = {}
      if (orderByArg?.createdAt) {
        orderBy.createdAt = orderByArg.createdAt
      }
      if (orderByArg?.updatedAt) {
        orderBy.updatedAt = orderByArg.updatedAt
      }

      const result = await ctx.externalApiQuery(
        MyMindLogsDocument,
        {
          first: take,
          skip,
          where: Object.keys(where).length > 0 ? where : undefined,
          orderBy: Object.keys(orderBy).length > 0 ? [orderBy] : undefined,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.myMindLogs ?? []
    },
  }),
)

builder.queryField('freeCodeMyMindLogsCount', (t) =>
  t.field({
    type: 'Int',
    args: {
      where: t.arg({ type: FreeCodeMindLogWhereInput, required: false }),
    },
    resolve: async (_root, args, ctx) => {
      const { where: whereArg } = args

      const { MyMindLogsDocument } =
        await import('server/externalApiClient/gql/generated')

      const where: Record<string, unknown> = {}
      if (whereArg?.type) {
        where.type = { equals: whereArg.type }
      }
      if (whereArg?.relatedToUserId) {
        where.relatedToUserId = { equals: whereArg.relatedToUserId }
      }

      const result = await ctx.externalApiQuery(
        MyMindLogsDocument,
        {
          first: 1,
          where: Object.keys(where).length > 0 ? where : undefined,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.myMindLogsCount ?? 0
    },
  }),
)
