import { builder } from '../../builder'
import { SortOrder } from '../common'
import { KBIdentityOperationTypeEnum } from './enums'

export const KBIdentityOperationOrderByInput = builder.inputType(
  'KBIdentityOperationOrderByInput',
  {
    fields: (t) => ({
      createdAt: t.field({ type: SortOrder }),
      operation: t.field({ type: SortOrder }),
    }),
  },
)

export const KBIdentityOperationWhereInput = builder.inputType(
  'KBIdentityOperationWhereInput',
  {
    fields: (t) => ({
      operation: t.field({ type: KBIdentityOperationTypeEnum }),
    }),
  },
)

export const KBIdentityOperationCreateInput = builder.inputType(
  'KBIdentityOperationCreateInput',
  {
    fields: (t) => ({
      operation: t.field({ type: KBIdentityOperationTypeEnum, required: true }),
      rationale: t.string(),
      inputIds: t.stringList({ required: true }),
      outputIds: t.stringList({ required: true }),
    }),
  },
)

export const KBIdentityOperationUpdateInput = builder.inputType(
  'KBIdentityOperationUpdateInput',
  {
    fields: (t) => ({
      operation: t.field({ type: KBIdentityOperationTypeEnum }),
      rationale: t.string(),
      inputIds: t.stringList(),
      outputIds: t.stringList(),
    }),
  },
)
