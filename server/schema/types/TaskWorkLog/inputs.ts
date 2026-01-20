import { builder } from '../../builder'

export const TaskWorkLogWhereUniqueInput = builder.inputType(
  'TaskWorkLogWhereUniqueInput',
  {
    fields: (t) => ({
      id: t.string({ required: true }),
    }),
  },
)

export const TaskWorkLogWhereInput = builder.inputType(
  'TaskWorkLogWhereInput',
  {
    fields: (t) => ({
      taskId: t.string(),
    }),
  },
)

export const TaskWorkLogCreateInput = builder.inputType(
  'TaskWorkLogCreateInput',
  {
    fields: (t) => ({
      taskId: t.string({ required: true }),
      content: t.string({ required: true }),
    }),
  },
)
