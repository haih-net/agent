import { builder } from 'server/schema/builder'
import { FreeCodeTask, TaskStatus } from '../index'
import type {
  TasksQuery,
  TasksQueryVariables,
  TaskWhereInput,
} from 'server/externalApiClient/gql/generated'
import { TaskStatus as GqlTaskStatus } from 'server/externalApiClient/gql/generated'

const FreeCodeTaskWhereInput = builder.inputType('FreeCodeTaskWhereInput', {
  fields: (t) => ({
    id: t.string({ required: false }),
    name: t.string({ required: false }),
    projectId: t.string({ required: false }),
    status: t.field({ type: TaskStatus, required: false }),
    needHelp: t.boolean({ required: false }),
  }),
})

builder.queryField('freeCodeTasks', (t) =>
  t.field({
    type: [FreeCodeTask],
    args: {
      where: t.arg({ type: FreeCodeTaskWhereInput, required: false }),
      take: t.arg.int({ defaultValue: 10 }),
      skip: t.arg.int({ required: false }),
    },
    resolve: async (_root, args, ctx) => {
      const { take, skip, where: whereArg } = args

      const { TasksDocument } =
        await import('server/externalApiClient/gql/generated')

      let where: TaskWhereInput | undefined
      if (whereArg) {
        where = {}
        if (whereArg.id) {
          where.id = { equals: whereArg.id }
        }
        if (whereArg.name) {
          where.name = { contains: whereArg.name }
        }
        if (whereArg.projectId) {
          where.projectId = { equals: whereArg.projectId }
        }
        if (whereArg.status) {
          where.status = { equals: whereArg.status as GqlTaskStatus }
        }
        if (whereArg.needHelp !== null && whereArg.needHelp !== undefined) {
          where.needHelp = { equals: whereArg.needHelp }
        }
      }

      const result = await ctx.externalApiQuery<
        TasksQuery,
        TasksQueryVariables
      >(
        TasksDocument,
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

      return result.data?.tasks ?? []
    },
  }),
)

builder.queryField('freeCodeTasksCount', (t) =>
  t.field({
    type: 'Int',
    args: {
      where: t.arg({ type: FreeCodeTaskWhereInput, required: false }),
    },
    resolve: async (_root, args, ctx) => {
      const { where: whereArg } = args

      const { TasksDocument } =
        await import('server/externalApiClient/gql/generated')

      let where: TaskWhereInput | undefined
      if (whereArg) {
        where = {}
        if (whereArg.id) {
          where.id = { equals: whereArg.id }
        }
        if (whereArg.name) {
          where.name = { contains: whereArg.name }
        }
        if (whereArg.projectId) {
          where.projectId = { equals: whereArg.projectId }
        }
        if (whereArg.status) {
          where.status = { equals: whereArg.status as GqlTaskStatus }
        }
        if (whereArg.needHelp !== null && whereArg.needHelp !== undefined) {
          where.needHelp = { equals: whereArg.needHelp }
        }
      }

      const result = await ctx.externalApiQuery<
        TasksQuery,
        TasksQueryVariables
      >(
        TasksDocument,
        {
          take: 1,
          where,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.tasksCount ?? 0
    },
  }),
)
