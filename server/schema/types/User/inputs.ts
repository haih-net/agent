import { builder } from '../../builder'

export const UserWhereUniqueInput = builder.inputType('UserWhereUniqueInput', {
  fields: (t) => ({
    id: t.string(),
    email: t.string(),
    username: t.string(),
  }),
})

export const UserWhereInput = builder.inputType('UserWhereInput', {
  fields: (t) => ({
    id: t.string(),
    email: t.string(),
    username: t.string(),
  }),
})

export const AuthPayload = builder.simpleObject('AuthPayload', {
  fields: (t) => ({
    success: t.boolean(),
    message: t.string({ nullable: true }),
    token: t.string({ nullable: true }),
  }),
})

export const UserSignupDataInput = builder.inputType('UserSignupDataInput', {
  fields: (t) => ({
    email: t.string(),
    password: t.string({ required: true }),
    username: t.string(),
    fullname: t.string(),
  }),
})

export const UserSigninDataInput = builder.inputType('UserSigninDataInput', {
  fields: (t) => ({
    password: t.string({ required: true }),
  }),
})

export const CurrentUserUpdateInput = builder.inputType(
  'CurrentUserUpdateInput',
  {
    fields: (t) => ({
      username: t.string(),
      fullname: t.string(),
      password: t.string(),
      image: t.string(),
      content: t.string(),
    }),
  },
)
