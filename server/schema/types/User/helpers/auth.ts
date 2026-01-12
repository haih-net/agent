import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { User } from '@prisma/client'
import { PrismaContext } from 'server/context/interfaces'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET env is empty')
}

const JWT_SECRET = process.env.JWT_SECRET

export interface TokenPayload {
  tokenId: string
  userId: string | null
}

export async function createToken(
  user: User,
  ctx: PrismaContext,
): Promise<string> {
  const token = await ctx.prisma.token.create({
    data: {
      User: {
        connect: { id: user.id },
      },
    },
  })

  const payload: TokenPayload = {
    tokenId: token.id,
    userId: token.userId,
  }

  return jwt.sign(payload, JWT_SECRET)
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
