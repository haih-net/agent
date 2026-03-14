import { PostStatus, Prisma } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'

interface PostWhereInput {
  status?: 'draft' | 'published' | 'unpublished' | null
}

export function buildPostWhere(
  where: PostWhereInput | null | undefined,
  ctx: PrismaContext | undefined,
): Prisma.PostWhereInput {
  const { currentUser } = ctx || {}

  const { status, ...other } = where || {}

  const result: Prisma.PostWhereInput = {
    status: status ?? PostStatus.published,
    ...other,
  }

  if (currentUser && !status) {
    if (currentUser.sudo) {
      result.status = undefined
    } else {
      result.OR = [
        {
          createdById: currentUser.id,
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
