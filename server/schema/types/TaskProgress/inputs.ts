import { builder } from '../../builder'

export const TaskProgressWhereUniqueInput = builder.inputType(
  'TaskProgressWhereUniqueInput',
  {
    fields: (t) => ({
      id: t.string({ required: true }),
    }),
  },
)

export const TaskProgressWhereInput = builder.inputType(
  'TaskProgressWhereInput',
  {
    fields: (t) => ({
      taskId: t.string(),
    }),
  },
)

export const TaskProgressCreateInput = builder.inputType(
  'TaskProgressCreateInput',
  {
    fields: (t) => ({
      taskId: t.string({ required: true }),
      content: t.string({ required: true }),
    }),
  },
)

export const TaskProgressResponse = builder.simpleObject(
  'TaskProgressResponse',
  {
    fields: (t) => ({
      success: t.boolean({ nullable: false }),
      message: t.string({ nullable: false }),
    }),
  },
)
