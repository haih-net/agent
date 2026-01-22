import { builder } from '../../builder'
import { KBConflictStatus } from '@prisma/client'

export const KBConflictStatusEnum = builder.enumType('KBConflictStatus', {
  values: Object.values(KBConflictStatus),
})
