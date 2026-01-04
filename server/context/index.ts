import type { User } from '@prisma/client'
import { externalApiQuery } from '../externalApiClient'
import { prismaClient } from '../prisma'
import { verifyToken } from '../schema/types/User/helpers/auth'
import { PrismaContext } from './interfaces'

type CreateContextArgs = {
  req: PrismaContext['req'] | { headers: { authorization: string | undefined } }
}

export async function createContext({
  req,
}: CreateContextArgs): Promise<PrismaContext> {
  let currentUser: User | null = null
  let token: string | null = null

  const authHeader = req?.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7)
    const payload = verifyToken(token)
    if (payload?.userId) {
      currentUser = await prismaClient.user.findUnique({
        where: { id: payload.userId },
      })
    }
  }

  return {
    prisma: prismaClient,
    currentUser,
    Token: null,
    token,
    req,
    externalApiQuery,
  }
}
