import { builder } from '../../builder'
import { SortOrder } from '../common'

export const KBConstraintOrderByInput = builder.inputType(
  'KBConstraintOrderByInput',
  {
    fields: (t) => ({
      createdAt: t.field({ type: SortOrder }),
    }),
  },
)

export const KBConstraintWhereInput = builder.inputType(
  'KBConstraintWhereInput',
  {
    fields: (t) => ({
      constraint: t.string(),
    }),
  },
)

export const KBConstraintCreateInput = builder.inputType(
  'KBConstraintCreateInput',
  {
    fields: (t) => ({
      constraint: t.string({ required: true }),
      scope: t.field({ type: 'Json' }),
    }),
  },
)

export const KBConstraintUpdateInput = builder.inputType(
  'KBConstraintUpdateInput',
  {
    fields: (t) => ({
      constraint: t.string(),
      scope: t.field({ type: 'Json' }),
    }),
  },
)
