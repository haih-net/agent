import { builder } from 'server/schema/builder'
import type {
  SigninMutation,
  SigninMutationVariables,
} from 'server/externalApiClient/gql/generated'
import { FreeCodeAuthResponse } from '../../FreeCodeAuthResponse'
import {
  FreeCodeUserSigninDataInput,
  FreeCodeUserWhereUniqueInput,
} from '../inputs'

builder.mutationField('freeCodeSignin', (t) =>
  t.field({
    type: FreeCodeAuthResponse,
    args: {
      data: t.arg({ type: FreeCodeUserSigninDataInput, required: true }),
      where: t.arg({
        type: FreeCodeUserWhereUniqueInput,
        required: true,
      }),
    },
    resolve: async (_root, args, ctx) => {
      const { data, where } = args

      const { SigninDocument } =
        await import('server/externalApiClient/gql/generated')

      const result = await ctx.externalApiQuery<
        SigninMutation,
        SigninMutationVariables
      >(
        SigninDocument,
        {
          data: {
            password: data.password,
          },
          where,
        },
        ctx,
      )

      if (result.errors?.length) {
        return {
          success: false,
          message: result.errors[0].message,
          token: null,
          data: null,
        }
      }

      return {
        success: result.data?.signin?.success ?? false,
        message: result.data?.signin?.message ?? '',
        token: result.data?.signin?.token ?? null,
        data: result.data?.signin?.data ?? null,
      }
    },
  }),
)
