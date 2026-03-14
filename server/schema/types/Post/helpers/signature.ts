import jwt from 'jsonwebtoken'
import Web3 from 'web3'
import type { PostStatus } from '@prisma/client'
import { JWT_SECRET } from 'server/helpers/jwt'

export interface PostSignableData {
  id: string
  title: string | null
  description: string | null
  intro: string | null
  content: string
  status: PostStatus
  createdAt: Date
  updatedAt: Date
}

export function buildSignableMessage(data: PostSignableData): string {
  return JSON.stringify({
    id: data.id,
    title: data.title,
    description: data.description,
    intro: data.intro,
    content: data.content,
    status: data.status,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  })
}

export function createServerSignToken(data: PostSignableData): string {
  const message = buildSignableMessage(data)
  return jwt.sign({ message }, JWT_SECRET, { expiresIn: '5m' })
}

export function verifyServerSignToken(
  token: string,
  data: PostSignableData,
): boolean {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { message: string }
    const expectedMessage = buildSignableMessage(data)
    return payload.message === expectedMessage
  } catch {
    return false
  }
}

export function verifyUserSignature(
  data: PostSignableData,
  signature: string,
  expectedAddress: string,
): boolean {
  try {
    const web3 = new Web3()
    const message = buildSignableMessage(data)
    const recoveredAddress = web3.eth.accounts.recover(message, signature)
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase()
  } catch {
    return false
  }
}
