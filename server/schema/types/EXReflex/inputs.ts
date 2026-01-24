import { builder } from '../../builder'
import { SortOrder } from '../common'
import { EXReflexTypeEnum, EXReflexStatusEnum } from './enums'

export const EXReflexOrderByInput = builder.inputType('EXReflexOrderByInput', {
  fields: (t) => ({
    createdAt: t.field({ type: SortOrder }),
    effectiveness: t.field({ type: SortOrder }),
    executionRate: t.field({ type: SortOrder }),
  }),
})

export const EXReflexWhereInput = builder.inputType('EXReflexWhereInput', {
  fields: (t) => ({
    type: t.field({ type: EXReflexTypeEnum }),
    status: t.field({ type: EXReflexStatusEnum }),
  }),
})

export const EXReflexCreateInput = builder.inputType('EXReflexCreateInput', {
  fields: (t) => ({
    type: t.field({ type: EXReflexTypeEnum }),
    status: t.field({ type: EXReflexStatusEnum }),
    stimulus: t.string({ required: true }),
    response: t.string({ required: true }),
  }),
})

export const EXReflexUpdateInput = builder.inputType('EXReflexUpdateInput', {
  fields: (t) => ({
    type: t.field({ type: EXReflexTypeEnum }),
    status: t.field({ type: EXReflexStatusEnum }),
    stimulus: t.string(),
    response: t.string(),
    effectiveness: t.float(),
    executionRate: t.float(),
  }),
})
