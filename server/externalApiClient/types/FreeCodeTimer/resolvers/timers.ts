import { builder } from 'server/schema/builder'
import { FreeCodeTimer } from '../index'
import type {
  TimersQuery,
  TimersQueryVariables,
  TimerWhereInput,
} from 'server/externalApiClient/gql/generated'
import { SortOrder } from 'server/externalApiClient/gql/generated'
import { FreeCodeSortOrder } from 'server/externalApiClient/types/FreeCodeProject/resolvers/projects'

const FreeCodeTimerOrderByInput = builder.inputType(
  'FreeCodeTimerOrderByInput',
  {
    fields: (t) => ({
      createdAt: t.field({ type: FreeCodeSortOrder, required: false }),
      updatedAt: t.field({ type: FreeCodeSortOrder, required: false }),
    }),
  },
)

const FreeCodeTimerWhereInput = builder.inputType('FreeCodeTimerWhereInput', {
  fields: (t) => ({
    id: t.string({ required: false }),
    Task: t.string({ required: false }),
    stopedAt_null: t.boolean({ required: false }),
  }),
})

builder.queryField('freeCodeTimers', (t) =>
  t.field({
    type: [FreeCodeTimer],
    args: {
      where: t.arg({ type: FreeCodeTimerWhereInput, required: false }),
      orderBy: t.arg({ type: FreeCodeTimerOrderByInput, required: false }),
      take: t.arg.int({ defaultValue: 10 }),
      skip: t.arg.int({ required: false }),
    },
    resolve: async (_root, args, ctx) => {
      const { take, skip, where: whereArg, orderBy: orderByArg } = args

      const { TimersDocument } =
        await import('server/externalApiClient/gql/generated')

      let where: TimerWhereInput | undefined
      if (whereArg) {
        where = {}
        if (whereArg.id) {
          where.id = { equals: whereArg.id }
        }
        if (whereArg.Task) {
          where.Task = { equals: whereArg.Task }
        }
        if (whereArg.stopedAt_null === true) {
          where.stopedAt = null
        }
        if (whereArg.stopedAt_null === false) {
          where.stopedAt = { not: null }
        }
      }

      let orderBy: TimersQueryVariables['orderBy']
      if (orderByArg) {
        orderBy = {}
        if (orderByArg.createdAt) {
          orderBy.createdAt = orderByArg.createdAt as SortOrder
        }
        if (orderByArg.updatedAt) {
          orderBy.updatedAt = orderByArg.updatedAt as SortOrder
        }
      }

      const result = await ctx.externalApiQuery<
        TimersQuery,
        TimersQueryVariables
      >(
        TimersDocument,
        {
          take,
          skip,
          where,
          orderBy,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.timers ?? []
    },
  }),
)

builder.queryField('freeCodeTimersCount', (t) =>
  t.field({
    type: 'Int',
    args: {
      where: t.arg({ type: FreeCodeTimerWhereInput, required: false }),
    },
    resolve: async (_root, args, ctx) => {
      const { where: whereArg } = args

      const { TimersDocument } =
        await import('server/externalApiClient/gql/generated')

      let where: TimerWhereInput | undefined
      if (whereArg) {
        where = {}
        if (whereArg.id) {
          where.id = { equals: whereArg.id }
        }
        if (whereArg.Task) {
          where.Task = { equals: whereArg.Task }
        }
        if (whereArg.stopedAt_null === true) {
          where.stopedAt = null
        }
        if (whereArg.stopedAt_null === false) {
          where.stopedAt = { not: null }
        }
      }

      const result = await ctx.externalApiQuery<
        TimersQuery,
        TimersQueryVariables
      >(
        TimersDocument,
        {
          take: 1,
          where,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.timersCount ?? 0
    },
  }),
)
