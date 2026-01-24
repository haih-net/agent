import { builder } from '../../builder'
import { EXReflexType, EXReflexStatus } from '@prisma/client'

export const EXReflexTypeEnum = builder.enumType('EXReflexType', {
  values: Object.values(EXReflexType),
})

export const EXReflexStatusEnum = builder.enumType('EXReflexStatus', {
  values: Object.values(EXReflexStatus),
})
