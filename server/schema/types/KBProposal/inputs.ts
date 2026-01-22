import { builder } from '../../builder'
import { SortOrder } from '../common'
import { KBProposalStatusEnum } from './enums'

export const KBProposalOrderByInput = builder.inputType(
  'KBProposalOrderByInput',
  {
    fields: (t) => ({
      createdAt: t.field({ type: SortOrder }),
      status: t.field({ type: SortOrder }),
    }),
  },
)

export const KBProposalWhereInput = builder.inputType('KBProposalWhereInput', {
  fields: (t) => ({
    status: t.field({ type: KBProposalStatusEnum }),
    testedBy: t.string(),
  }),
})

export const KBProposalCreateInput = builder.inputType(
  'KBProposalCreateInput',
  {
    fields: (t) => ({
      statement: t.string({ required: true }),
      status: t.field({ type: KBProposalStatusEnum }),
      testedBy: t.string(),
    }),
  },
)

export const KBProposalUpdateInput = builder.inputType(
  'KBProposalUpdateInput',
  {
    fields: (t) => ({
      statement: t.string(),
      status: t.field({ type: KBProposalStatusEnum }),
      testedBy: t.string(),
    }),
  },
)
