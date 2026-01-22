import { builder } from '../../builder'
import { SortOrder } from '../common'
import { KBDecisionStatusEnum } from './enums'

export const KBDecisionOrderByInput = builder.inputType(
  'KBDecisionOrderByInput',
  {
    fields: (t) => ({
      createdAt: t.field({ type: SortOrder }),
      status: t.field({ type: SortOrder }),
      subject: t.field({ type: SortOrder }),
    }),
  },
)

export const KBDecisionWhereInput = builder.inputType('KBDecisionWhereInput', {
  fields: (t) => ({
    status: t.field({ type: KBDecisionStatusEnum }),
    subject: t.string(),
    revisedById: t.string(),
  }),
})

export const KBDecisionCreateInput = builder.inputType(
  'KBDecisionCreateInput',
  {
    fields: (t) => ({
      subject: t.string({ required: true }),
      decision: t.string({ required: true }),
      context: t.field({ type: 'Json' }),
      outcome: t.field({ type: 'Json' }),
      status: t.field({ type: KBDecisionStatusEnum }),
      revisedById: t.string(),
    }),
  },
)

export const KBDecisionUpdateInput = builder.inputType(
  'KBDecisionUpdateInput',
  {
    fields: (t) => ({
      subject: t.string(),
      decision: t.string(),
      context: t.field({ type: 'Json' }),
      outcome: t.field({ type: 'Json' }),
      status: t.field({ type: KBDecisionStatusEnum }),
      revisedById: t.string(),
    }),
  },
)
