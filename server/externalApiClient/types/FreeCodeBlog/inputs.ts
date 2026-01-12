import { builder } from 'server/schema/builder'

export const FreeCodeBlogWhereUniqueInput = builder.inputType(
  'FreeCodeBlogWhereUniqueInput',
  {
    fields: (t) => ({
      id: t.string(),
    }),
  },
)

export const FreeCodeBlogWhereInput = builder.inputType(
  'FreeCodeBlogWhereInput',
  {
    fields: (t) => ({
      id: t.string({ required: false }),
      name: t.string({ required: false }),
      published: t.boolean({ required: false }),
      deleted: t.boolean({ required: false }),
      createdBy: t.string({ required: false }),
    }),
  },
)
