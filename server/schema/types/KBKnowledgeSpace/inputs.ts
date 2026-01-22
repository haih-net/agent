import { builder } from '../../builder'
import { SortOrder } from '../common'
import { KBKnowledgeSpaceTypeEnum } from './enums'

export const KBKnowledgeSpaceOrderByInput = builder.inputType(
  'KBKnowledgeSpaceOrderByInput',
  {
    fields: (t) => ({
      createdAt: t.field({ type: SortOrder }),
      name: t.field({ type: SortOrder }),
      type: t.field({ type: SortOrder }),
    }),
  },
)

export const KBKnowledgeSpaceWhereInput = builder.inputType(
  'KBKnowledgeSpaceWhereInput',
  {
    fields: (t) => ({
      type: t.field({ type: KBKnowledgeSpaceTypeEnum }),
      name: t.string(),
    }),
  },
)

export const KBKnowledgeSpaceCreateInput = builder.inputType(
  'KBKnowledgeSpaceCreateInput',
  {
    fields: (t) => ({
      type: t.field({ type: KBKnowledgeSpaceTypeEnum }),
      name: t.string({ required: true }),
      description: t.string(),
    }),
  },
)

export const KBKnowledgeSpaceUpdateInput = builder.inputType(
  'KBKnowledgeSpaceUpdateInput',
  {
    fields: (t) => ({
      type: t.field({ type: KBKnowledgeSpaceTypeEnum }),
      name: t.string(),
      description: t.string(),
    }),
  },
)
