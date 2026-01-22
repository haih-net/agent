import { builder } from '../builder'
import {
  KBLabelRole,
  KBFactStatus,
  KBFactType,
  KBProposalStatus,
  KBDecisionStatus,
  KBConflictStatus,
  KBIdentityOperationType,
  KBKnowledgeSpaceType,
  KBFactProjectionVisibility,
} from '@prisma/client'

// KB Label enums
export const KBLabelRoleEnum = builder.enumType('KBLabelRole', {
  values: Object.values(KBLabelRole),
})

// KB Fact enums
export const KBFactStatusEnum = builder.enumType('KBFactStatus', {
  values: Object.values(KBFactStatus),
})

export const KBFactTypeEnum = builder.enumType('KBFactType', {
  values: Object.values(KBFactType),
})

// KB Proposal enums
export const KBProposalStatusEnum = builder.enumType('KBProposalStatus', {
  values: Object.values(KBProposalStatus),
})

// KB Decision enums
export const KBDecisionStatusEnum = builder.enumType('KBDecisionStatus', {
  values: Object.values(KBDecisionStatus),
})

// KB Conflict enums
export const KBConflictStatusEnum = builder.enumType('KBConflictStatus', {
  values: Object.values(KBConflictStatus),
})

// KB Identity Operation enums
export const KBIdentityOperationTypeEnum = builder.enumType(
  'KBIdentityOperationType',
  {
    values: Object.values(KBIdentityOperationType),
  },
)

// KB Knowledge Space enums
export const KBKnowledgeSpaceTypeEnum = builder.enumType(
  'KBKnowledgeSpaceType',
  {
    values: Object.values(KBKnowledgeSpaceType),
  },
)

// KB Fact Projection enums
export const KBFactProjectionVisibilityEnum = builder.enumType(
  'KBFactProjectionVisibility',
  {
    values: Object.values(KBFactProjectionVisibility),
  },
)
