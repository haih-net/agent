import { builder } from 'server/schema/builder'

const MIND_LOG_TYPE_VALUES = [
  'Stimulus',
  'Reaction',
  'Action',
  'Error',
  'Result',
  'Conclusion',
  'Evaluation',
  'Correction',
  'Knowledge',
] as const

export const MindLogType = builder.enumType('MindLogType', {
  values: MIND_LOG_TYPE_VALUES,
})

export const FreeCodeMindLogCreateInput = builder.inputType(
  'FreeCodeMindLogCreateInput',
  {
    fields: (t) => ({
      type: t.field({ type: MindLogType, required: true }),
      data: t.string({ required: true }),
      quality: t.float({ required: false }),
    }),
  },
)

export const FreeCodeMindLogUpdateInput = builder.inputType(
  'FreeCodeMindLogUpdateInput',
  {
    fields: (t) => ({
      data: t.string({ required: false }),
      quality: t.float({ required: false }),
    }),
  },
)

export const FreeCodeMindLogWhereUniqueInput = builder.inputType(
  'FreeCodeMindLogWhereUniqueInput',
  {
    fields: (t) => ({
      id: t.string({ required: true }),
    }),
  },
)

export const FreeCodeMindLog = builder.simpleObject('FreeCodeMindLog', {
  fields: (t) => ({
    id: t.id(),
    createdAt: t.field({ type: 'DateTime', nullable: true }),
    updatedAt: t.field({ type: 'DateTime', nullable: true }),
    type: t.field({ type: MindLogType }),
    data: t.string(),
    quality: t.float({ nullable: true }),
    createdById: t.string(),
  }),
})

export const FreeCodeMindLogResponse = builder.simpleObject(
  'FreeCodeMindLogResponse',
  {
    fields: (t) => ({
      success: t.boolean(),
      message: t.string(),
      data: t.field({ type: FreeCodeMindLog, nullable: true }),
    }),
  },
)

import './resolvers/myMindLogs'
import './resolvers/mindLog'
import './resolvers/createMindLog'
import './resolvers/updateMindLog'
import './resolvers/deleteMindLog'
