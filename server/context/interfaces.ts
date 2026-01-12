import { ExpressContextFunctionArgument } from '@as-integrations/express4'
import type { PrismaClient, Token, User } from '@prisma/client'

export interface PrismaContext {
  prisma: PrismaClient
  req:
    | ExpressContextFunctionArgument['req']
    | { headers: { authorization: string | undefined } }
    | undefined

  // Authorized user
  currentUser: User | null

  /**
   * Current user Auth token
   */
  Token: (Token & { User: User | null }) | null

  /**
   * Raw JWT token from Authorization header (for external API calls)
   */
  token: string | null
}
