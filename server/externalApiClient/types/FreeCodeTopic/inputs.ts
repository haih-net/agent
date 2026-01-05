import { builder } from 'server/schema/builder'

export const FreeCodeTopicWhereUniqueInput = builder.inputType(
  'FreeCodeTopicWhereUniqueInput',
  {
    fields: (t) => ({
      id: t.string(),
    }),
  },
)

export const FreeCodeTopicWhereInput = builder.inputType(
  'FreeCodeTopicWhereInput',
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

export const FreeCodeTopicCreateInput = builder.inputType(
  'FreeCodeTopicCreateInput',
  {
    fields: (t) => ({
      name: t.string({ required: false }),
      longtitle: t.string({ required: false }),
      intro: t.string({ required: false }),
      contentV2: t.string({ required: false }),
      blogID: t.string({ required: false }),
      uri: t.string({ required: false }),
    }),
  },
)

export const FreeCodeTopicUpdateInput = builder.inputType(
  'FreeCodeTopicUpdateInput',
  {
    fields: (t) => ({
      name: t.string({ required: false }),
      longtitle: t.string({ required: false }),
      intro: t.string({ required: false }),
      contentV2: t.string({ required: false }),
      blogID: t.string({ required: false }),
      uri: t.string({ required: false }),
    }),
  },
)
