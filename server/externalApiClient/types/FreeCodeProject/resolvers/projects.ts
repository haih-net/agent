import { builder } from 'server/schema/builder'
import { FreeCodeProject, ProjectStatus } from '../index'
import type {
  ProjectsQuery,
  ProjectsQueryVariables,
  ProjectWhereInput,
} from 'server/externalApiClient/gql/generated'
import {
  ProjectStatus as GqlProjectStatus,
  SortOrder,
} from 'server/externalApiClient/gql/generated'

export const FreeCodeSortOrder = builder.enumType('FreeCodeSortOrder', {
  values: ['asc', 'desc'] as const,
})

const FreeCodeProjectOrderByInput = builder.inputType(
  'FreeCodeProjectOrderByInput',
  {
    fields: (t) => ({
      createdAt: t.field({ type: FreeCodeSortOrder, required: false }),
      updatedAt: t.field({ type: FreeCodeSortOrder, required: false }),
      name: t.field({ type: FreeCodeSortOrder, required: false }),
    }),
  },
)

const FreeCodeProjectWhereInput = builder.inputType(
  'FreeCodeProjectWhereInput',
  {
    fields: (t) => ({
      id: t.string({ required: false }),
      name: t.string({ required: false }),
      status: t.field({ type: ProjectStatus, required: false }),
    }),
  },
)

builder.queryField('freeCodeProjects', (t) =>
  t.field({
    type: [FreeCodeProject],
    args: {
      where: t.arg({ type: FreeCodeProjectWhereInput, required: false }),
      orderBy: t.arg({ type: FreeCodeProjectOrderByInput, required: false }),
      take: t.arg.int({ defaultValue: 10 }),
      skip: t.arg.int({ required: false }),
    },
    resolve: async (_root, args, ctx) => {
      const { take, skip, where: whereArg, orderBy: orderByArg } = args

      const { ProjectsDocument } =
        await import('server/externalApiClient/gql/generated')

      let where: ProjectWhereInput | undefined
      if (whereArg) {
        where = {}
        if (whereArg.id) {
          where.id = { equals: whereArg.id }
        }
        if (whereArg.name) {
          where.name = { contains: whereArg.name }
        }
        if (whereArg.status) {
          where.status = { equals: whereArg.status as GqlProjectStatus }
        }
      }

      let orderBy: ProjectsQueryVariables['orderBy']
      if (orderByArg) {
        orderBy = {}
        if (orderByArg.createdAt) {
          orderBy.createdAt = orderByArg.createdAt as SortOrder
        }
        if (orderByArg.updatedAt) {
          orderBy.updatedAt = orderByArg.updatedAt as SortOrder
        }
        if (orderByArg.name) {
          orderBy.name = orderByArg.name as SortOrder
        }
      }

      const result = await ctx.externalApiQuery<
        ProjectsQuery,
        ProjectsQueryVariables
      >(
        ProjectsDocument,
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

      return result.data?.projects ?? []
    },
  }),
)

builder.queryField('freeCodeProjectsCount', (t) =>
  t.field({
    type: 'Int',
    args: {
      where: t.arg({ type: FreeCodeProjectWhereInput, required: false }),
    },
    resolve: async (_root, args, ctx) => {
      const { where: whereArg } = args

      const { ProjectsDocument } =
        await import('server/externalApiClient/gql/generated')

      let where: ProjectWhereInput | undefined
      if (whereArg) {
        where = {}
        if (whereArg.id) {
          where.id = { equals: whereArg.id }
        }
        if (whereArg.name) {
          where.name = { contains: whereArg.name }
        }
        if (whereArg.status) {
          where.status = { equals: whereArg.status as GqlProjectStatus }
        }
      }

      const result = await ctx.externalApiQuery<
        ProjectsQuery,
        ProjectsQueryVariables
      >(
        ProjectsDocument,
        {
          take: 1,
          where,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.projectsCount ?? 0
    },
  }),
)
