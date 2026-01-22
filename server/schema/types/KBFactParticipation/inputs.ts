import { builder } from '../../builder'
import { SortOrder } from '../common'

export const KBFactParticipationOrderByInput = builder.inputType(
  'KBFactParticipationOrderByInput',
  {
    fields: (t) => ({
      createdAt: t.field({ type: SortOrder }),
      role: t.field({ type: SortOrder }),
    }),
  },
)

export const KBFactParticipationWhereInput = builder.inputType(
  'KBFactParticipationWhereInput',
  {
    fields: (t) => ({
      factId: t.string(),
      conceptId: t.string(),
      role: t.string(),
      impact: t.string(),
    }),
  },
)

export const KBFactParticipationCreateInput = builder.inputType(
  'KBFactParticipationCreateInput',
  {
    fields: (t) => ({
      factId: t.string({ required: true }),
      conceptId: t.string({ required: true }),
      role: t.string({ required: true }),
      impact: t.string(),
      value: t.string(),
      localImportance: t.float(),
    }),
  },
)

export const KBFactParticipationUpdateInput = builder.inputType(
  'KBFactParticipationUpdateInput',
  {
    fields: (t) => ({
      role: t.string(),
      impact: t.string(),
      value: t.string(),
      localImportance: t.float(),
    }),
  },
)
