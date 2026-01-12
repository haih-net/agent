import { builder } from 'server/schema/builder'
import { FreeCodeBlog } from '../index'
import { mapBlog } from '../utils'
import { FreeCodeBlogWhereInput } from '../inputs'
import type {
  BlogsQuery,
  BlogsQueryVariables,
  BlogsCountQuery,
  BlogsCountQueryVariables,
  ResourceWhereInput,
} from 'server/externalApiClient/gql/generated'
import { ResourceType as ExternalResourceType } from 'server/externalApiClient/gql/generated'

builder.queryField('freeCodeBlogs', (t) =>
  t.field({
    type: [FreeCodeBlog],
    args: {
      where: t.arg({ type: FreeCodeBlogWhereInput, required: false }),
      take: t.arg.int({ defaultValue: 10 }),
      skip: t.arg.int({ required: false }),
    },
    resolve: async (_root, args, ctx) => {
      const { take, skip, where: whereArg } = args

      const { BlogsDocument } =
        await import('server/externalApiClient/gql/generated')

      const where: ResourceWhereInput = {
        type: { equals: ExternalResourceType.BLOG },
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
        BlogsQuery,
        BlogsQueryVariables
      >(
        BlogsDocument,
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

      const blogs = result.data?.resources ?? []
      return blogs
        .map(mapBlog)
        .filter((r): r is NonNullable<typeof r> => r !== null)
    },
  }),
)

builder.queryField('freeCodeBlogsCount', (t) =>
  t.field({
    type: 'Int',
    args: {
      where: t.arg({ type: FreeCodeBlogWhereInput, required: false }),
    },
    resolve: async (_root, args, ctx) => {
      const { where: whereArg } = args

      const { BlogsCountDocument } =
        await import('server/externalApiClient/gql/generated')

      const where: ResourceWhereInput = {
        type: { equals: ExternalResourceType.BLOG },
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
        BlogsCountQuery,
        BlogsCountQueryVariables
      >(
        BlogsCountDocument,
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
