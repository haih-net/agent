import { builder } from 'server/schema/builder'
import type {
  SignupMutation,
  SignupMutationVariables,
} from 'server/externalApiClient/gql/generated'
import { FreeCodeUserSignupDataInput } from '../inputs'
import { FreeCodeAuthResponse } from '../../FreeCodeAuthResponse'

builder.mutationField('freeCodeSignup', (t) =>
  t.field({
    type: FreeCodeAuthResponse,
    args: {
      data: t.arg({ type: FreeCodeUserSignupDataInput, required: true }),
    },
    resolve: async (_root, args, ctx) => {
      const { data } = args

      const { SignupDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery<
        SignupMutation,
        SignupMutationVariables
      >(
        SignupDocument,
        {
          data: {
            username: data.username,
            email: data.email,
            password: data.password,
            fullname: data.fullname,
          },
        },
        ctx,
      )

      if (result.errors?.length) {
        return {
          success: false,
          message: result.errors[0].message,
          token: null,
        }
      }

      return {
        success: result.data?.signup?.success ?? false,
        message: result.data?.signup?.message ?? '',
        token: result.data?.signup?.token ?? null,
      }
    },
  }),
)
