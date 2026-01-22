import { builder } from '../../builder'
import { SortOrder } from '../common'
import { KBFactProjectionVisibilityEnum } from './enums'

export const KBFactProjectionOrderByInput = builder.inputType(
  'KBFactProjectionOrderByInput',
  {
    fields: (t) => ({
      createdAt: t.field({ type: SortOrder }),
      trustLevel: t.field({ type: SortOrder }),
      importance: t.field({ type: SortOrder }),
    }),
  },
)

export const KBFactProjectionWhereInput = builder.inputType(
  'KBFactProjectionWhereInput',
  {
    fields: (t) => ({
      factId: t.string(),
      knowledgeSpaceId: t.string(),
      visibility: t.field({ type: KBFactProjectionVisibilityEnum }),
      trustLevel: t.float(),
      importance: t.float(),
    }),
  },
)

export const KBFactProjectionCreateInput = builder.inputType(
  'KBFactProjectionCreateInput',
  {
    fields: (t) => ({
      factId: t.string({ required: true }),
      knowledgeSpaceId: t.string({ required: true }),
      visibility: t.field({ type: KBFactProjectionVisibilityEnum }),
      trustLevel: t.float(),
      importance: t.float(),
      notes: t.string(),
    }),
  },
)

export const KBFactProjectionUpdateInput = builder.inputType(
  'KBFactProjectionUpdateInput',
  {
    fields: (t) => ({
      visibility: t.field({ type: KBFactProjectionVisibilityEnum }),
      trustLevel: t.float(),
      importance: t.float(),
      notes: t.string(),
    }),
  },
)
