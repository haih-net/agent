import { builder } from 'server/schema/builder'

export const FreeCodeUserSigninDataInput = builder.inputType(
  'FreeCodeUserSigninDataInput',
  {
    fields: (t) => ({
      password: t.string({ required: true }),
    }),
  },
)

export const FreeCodeUserWhereUniqueInput = builder.inputType(
  'FreeCodeUserWhereUniqueInput',
  {
    fields: (t) => ({
      id: t.string({ required: false }),
      username: t.string({ required: false }),
    }),
  },
)

export const FreeCodeUserSignupDataInput = builder.inputType(
  'FreeCodeUserSignupDataInput',
  {
    fields: (t) => ({
      username: t.string({ required: false }),
      email: t.string({ required: false }),
      password: t.string({ required: true }),
      fullname: t.string({ required: false }),
    }),
  },
)

export const FreeCodeUserWhereInput = builder.inputType(
  'FreeCodeUserWhereInput',
  {
    fields: (t) => ({
      id: t.string({ required: false }),
      username: t.string({ required: false }),
    }),
  },
)
