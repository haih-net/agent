import { builder } from '../../builder'
import { KBProposalStatus } from '@prisma/client'

export const KBProposalStatusEnum = builder.enumType('KBProposalStatus', {
  values: Object.values(KBProposalStatus),
})
