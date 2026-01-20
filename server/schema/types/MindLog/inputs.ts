import { builder } from '../../builder'
import { MindLogType } from './index'

export const MindLogWhereUniqueInput = builder.inputType(
  'MindLogWhereUniqueInput',
  {
    fields: (t) => ({
      id: t.string(),
    }),
  },
)

export const MindLogTypeWhereInput = builder.inputType(
  'MindLogTypeWhereInput',
  {
    fields: (t) => ({
      equals: t.field({ type: MindLogType }),
      in: t.field({ type: [MindLogType] }),
    }),
  },
)

export const MindLogWhereInput = builder.inputType('MindLogWhereInput', {
  fields: (t) => ({
    type: t.field({ type: MindLogTypeWhereInput }),
    relatedToUserId: t.string(),
  }),
})

export const MindLogCreateInput = builder.inputType('MindLogCreateInput', {
  fields: (t) => ({
    type: t.field({ type: MindLogType, required: true }),
    data: t.string({ required: true }),
    quality: t.float(),
    relatedToUserId: t.string(),
  }),
})

export const MindLogUpdateInput = builder.inputType('MindLogUpdateInput', {
  fields: (t) => ({
    data: t.string(),
    quality: t.float(),
  }),
})
