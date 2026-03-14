import { UserStatus, Prisma } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'

interface UserWhereInput {
  id?: string | null
  email?: string | null
  username?: string | null
  status?: UserStatus | null
}

export function buildUserWhere(
  where: UserWhereInput | null | undefined,
  ctx: PrismaContext | undefined,
): Prisma.UserWhereInput {
  const { currentUser } = ctx || {}

  const { status, id, ...other } = where || {}

  const result: Prisma.UserWhereInput = {
    status: status ?? UserStatus.active,
    id: id ?? undefined,
    ...other,
  }

  if (currentUser && !status) {
    if (currentUser.sudo) {
      result.status = undefined
    } else {
      result.OR = [
        {
          id: currentUser.id,
        },
        {
          status: result.status,
        },
      ]

      result.status = undefined
    }
  }

  return result
}
