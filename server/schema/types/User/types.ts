import { UserStatus } from '@prisma/client'
import { builder } from 'server/schema/builder'

export const UserStatusEnum = builder.enumType('UserStatusEnum', {
  values: Object.values(UserStatus),
})
