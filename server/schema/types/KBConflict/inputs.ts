import { builder } from '../../builder'
import { SortOrder } from '../common'
import { KBConflictStatusEnum } from './enums'

export const KBConflictOrderByInput = builder.inputType(
  'KBConflictOrderByInput',
  {
    fields: (t) => ({
      createdAt: t.field({ type: SortOrder }),
      status: t.field({ type: SortOrder }),
      severity: t.field({ type: SortOrder }),
    }),
  },
)

export const KBConflictWhereInput = builder.inputType('KBConflictWhereInput', {
  fields: (t) => ({
    type: t.string(),
    severity: t.string(),
    status: t.field({ type: KBConflictStatusEnum }),
    constraintId: t.string(),
  }),
})

export const KBConflictCreateInput = builder.inputType(
  'KBConflictCreateInput',
  {
    fields: (t) => ({
      type: t.string({ required: true }),
      severity: t.string({ required: true }),
      status: t.field({ type: KBConflictStatusEnum }),
      constraintId: t.string(),
    }),
  },
)

export const KBConflictUpdateInput = builder.inputType(
  'KBConflictUpdateInput',
  {
    fields: (t) => ({
      type: t.string(),
      severity: t.string(),
      status: t.field({ type: KBConflictStatusEnum }),
      constraintId: t.string(),
    }),
  },
)
