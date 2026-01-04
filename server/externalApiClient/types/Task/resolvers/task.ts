import { builder } from 'server/schema/builder'
import { FreeCodeTask } from '../index'
import type {
  TaskQuery,
  TaskQueryVariables,
} from 'server/externalApiClient/gql/generated'

const FreeCodeTaskWhereUniqueInput = builder.inputType(
  'FreeCodeTaskWhereUniqueInput',
  {
    fields: (t) => ({
      id: t.string({ required: true }),
    }),
  },
)

builder.queryField('freeCodeTask', (t) =>
  t.field({
    type: FreeCodeTask,
    nullable: true,
    args: {
      where: t.arg({ type: FreeCodeTaskWhereUniqueInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { where } = args

      const { TaskDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery<TaskQuery, TaskQueryVariables>(
        TaskDocument,
        {
          where: { id: where.id },
        },
        ctx,
      )

      if (result.errors?.length) {
        throw new Error(result.errors[0].message)
      }

      return result.data?.object ?? null
    },
  }),
)
