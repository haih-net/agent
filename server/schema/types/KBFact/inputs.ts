import { builder } from '../../builder'
import { SortOrder } from '../common'
import { KBFactStatusEnum } from './enums'

export const KBFactOrderByInput = builder.inputType('KBFactOrderByInput', {
  fields: (t) => ({
    createdAt: t.field({ type: SortOrder }),
    validFrom: t.field({ type: SortOrder }),
    confidence: t.field({ type: SortOrder }),
    importance: t.field({ type: SortOrder }),
  }),
})

export const KBFactWhereInput = builder.inputType('KBFactWhereInput', {
  fields: (t) => ({
    type: t.string(),
    status: t.field({ type: KBFactStatusEnum }),
    confidence: t.float(),
    importance: t.float(),
    validFrom: t.field({ type: 'DateTime' }),
    validTo: t.field({ type: 'DateTime' }),
  }),
})

export const KBFactCreateInput = builder.inputType('KBFactCreateInput', {
  fields: (t) => ({
    type: t.string({ required: true }),
    statement: t.string({ required: true }),
    validFrom: t.field({ type: 'DateTime' }),
    validTo: t.field({ type: 'DateTime' }),
    confidence: t.float(),
    importance: t.float(),
    source: t.string(),
    status: t.field({ type: KBFactStatusEnum }),
  }),
})

export const KBFactUpdateInput = builder.inputType('KBFactUpdateInput', {
  fields: (t) => ({
    type: t.string(),
    statement: t.string(),
    validFrom: t.field({ type: 'DateTime' }),
    validTo: t.field({ type: 'DateTime' }),
    confidence: t.float(),
    importance: t.float(),
    source: t.string(),
    status: t.field({ type: KBFactStatusEnum }),
  }),
})
