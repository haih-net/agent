import { builder } from '../../builder'
import { KBIdentityOperationType } from '@prisma/client'

export const KBIdentityOperationTypeEnum = builder.enumType(
  'KBIdentityOperationType',
  {
    values: Object.values(KBIdentityOperationType),
  },
)
