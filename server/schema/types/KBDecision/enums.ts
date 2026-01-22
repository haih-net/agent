import { builder } from '../../builder'
import { KBDecisionStatus } from '@prisma/client'

export const KBDecisionStatusEnum = builder.enumType('KBDecisionStatus', {
  values: Object.values(KBDecisionStatus),
})
