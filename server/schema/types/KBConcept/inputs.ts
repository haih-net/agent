import { builder } from '../../builder'
import { SortOrder } from '../common'

export const KBConceptOrderByInput = builder.inputType(
  'KBConceptOrderByInput',
  {
    fields: (t) => ({
      createdAt: t.field({ type: SortOrder }),
      name: t.field({ type: SortOrder }),
      type: t.field({ type: SortOrder }),
    }),
  },
)

export const KBConceptWhereInput = builder.inputType('KBConceptWhereInput', {
  fields: (t) => ({
    type: t.string(),
    // TODO Add KBConceptWhereNameInput
    name: t.string(),
  }),
})

export const KBConceptCreateInput = builder.inputType('KBConceptCreateInput', {
  fields: (t) => ({
    type: t.string(),
    name: t.string({ required: true }),
    description: t.string(),
    content: t.string(),
  }),
})

export const KBConceptUpdateInput = builder.inputType('KBConceptUpdateInput', {
  fields: (t) => ({
    type: t.string(),
    name: t.string(),
    description: t.string(),
    content: t.string(),
  }),
})
