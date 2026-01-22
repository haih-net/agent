import { builder } from '../../builder'
import { KBFactStatus, KBFactType } from '@prisma/client'

export const KBFactStatusEnum = builder.enumType('KBFactStatus', {
  values: Object.values(KBFactStatus),
})

export const KBFactTypeEnum = builder.enumType('KBFactType', {
  values: Object.values(KBFactType),
})
