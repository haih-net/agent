import { builder } from 'server/schema/builder'
import { FreeCodeBlog } from '../index'
import { mapBlog } from '../utils'
import { FreeCodeBlogWhereUniqueInput } from '../inputs'
import type {
  BlogQuery,
  BlogQueryVariables,
  ResourceWhereUniqueInput,
} from 'server/externalApiClient/gql/generated'

builder.queryField('freeCodeBlog', (t) =>
  t.field({
    type: FreeCodeBlog,
    nullable: true,
    args: {
      where: t.arg({ type: FreeCodeBlogWhereUniqueInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { where } = args

      const { BlogDocument } =
        await import('server/externalApiClient/gql/generated')

      const whereInput: ResourceWhereUniqueInput = {
        id: where.id,
      }

      const result = await ctx.externalApiQuery<BlogQuery, BlogQueryVariables>(
        BlogDocument,
        {
          where: whereInput,
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return mapBlog(result.data?.resource ?? null)
    },
  }),
)
