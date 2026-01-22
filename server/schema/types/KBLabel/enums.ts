import { builder } from '../../builder'
import { KBLabelRole } from '@prisma/client'

export const KBLabelRoleEnum = builder.enumType('KBLabelRole', {
  values: Object.values(KBLabelRole),
})
