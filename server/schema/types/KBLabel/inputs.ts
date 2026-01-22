import { builder } from '../../builder'
import { SortOrder } from '../common'
import { KBLabelRoleEnum } from './enums'

export const KBLabelOrderByInput = builder.inputType('KBLabelOrderByInput', {
  fields: (t) => ({
    createdAt: t.field({ type: SortOrder }),
    text: t.field({ type: SortOrder }),
    language: t.field({ type: SortOrder }),
  }),
})

export const KBLabelWhereInput = builder.inputType('KBLabelWhereInput', {
  fields: (t) => ({
    conceptId: t.string(),
    role: t.field({ type: KBLabelRoleEnum }),
    language: t.string(),
    text: t.string(),
  }),
})

export const KBLabelCreateInput = builder.inputType('KBLabelCreateInput', {
  fields: (t) => ({
    conceptId: t.string({ required: true }),
    text: t.string({ required: true }),
    language: t.string(),
    role: t.field({ type: KBLabelRoleEnum }),
  }),
})

export const KBLabelUpdateInput = builder.inputType('KBLabelUpdateInput', {
  fields: (t) => ({
    text: t.string(),
    language: t.string(),
    role: t.field({ type: KBLabelRoleEnum }),
  }),
})
