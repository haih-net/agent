import { TaskStatus, Prisma } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'

const COMPLETED_STATUSES = [TaskStatus.Done, TaskStatus.Rejected]

interface TaskWhereArgs {
  status?: TaskStatus | null
  parentId?: string | null
  incompletedOnly?: boolean | null
}

interface BuildTaskWhereOptions {
  myOnly?: boolean
}

export function buildTaskWhere(
  args?: TaskWhereArgs | null,
  options?: BuildTaskWhereOptions,
  ctx?: PrismaContext,
): Prisma.TaskWhereInput {
  const incompletedOnly = args?.incompletedOnly ?? true

  const where: Prisma.TaskWhereInput = {
    status:
      args?.status ??
      (incompletedOnly ? { notIn: COMPLETED_STATUSES } : undefined),
    parentId: args?.parentId ?? undefined,
  }

  if (options?.myOnly) {
    if (!ctx?.currentUser) {
      throw new Error('Unauthorized')
    }
    const userId = ctx.currentUser.id
    where.OR = [{ createdById: userId }, { assigneeId: userId }]
  }

  return where
}
