import { builder } from 'server/schema/builder'
import { FreeCodeProject } from '../index'
import type {
  ProjectQuery,
  ProjectQueryVariables,
} from 'server/externalApiClient/gql/generated'

const FreeCodeProjectWhereUniqueInput = builder.inputType(
  'FreeCodeProjectWhereUniqueInput',
  {
    fields: (t) => ({
      id: t.string({ required: true }),
    }),
  },
)

builder.queryField('freeCodeProject', (t) =>
  t.field({
    type: FreeCodeProject,
    nullable: true,
    args: {
      where: t.arg({ type: FreeCodeProjectWhereUniqueInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { where } = args

      const { ProjectDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery<
        ProjectQuery,
        ProjectQueryVariables
      >(
        ProjectDocument,
        {
          where: { id: where.id },
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.project ?? null
    },
  }),
)
