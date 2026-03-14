import jwt from 'jsonwebtoken'
import { JWT_SECRET } from 'server/helpers/jwt'
import Web3 from 'web3'

const NONCE_TTL_MS = 5 * 60 * 1000

interface NoncePayload {
  address: string
  timestamp: number
  random: string
}

export function generateNonce(address: string): string {
  const payload: NoncePayload = {
    address: address.toLowerCase(),
    timestamp: Date.now(),
    random: Math.random().toString(36).substring(2),
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '5m' })
}

export function verifyNonce(nonce: string, address: string): boolean {
  try {
    const payload = jwt.verify(nonce, JWT_SECRET) as NoncePayload
    if (payload.address !== address.toLowerCase()) {
      return false
    }
    if (Date.now() - payload.timestamp > NONCE_TTL_MS) {
      return false
    }
    return true
  } catch {
    return false
  }
}

export function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string,
): boolean {
  try {
    const web3 = new Web3()
    const recoveredAddress = web3.eth.accounts.recover(message, signature)
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase()
  } catch {
    return false
  }
}

export function buildSignMessage(nonce: string): string {
  return `Sign this message to authenticate:\n${nonce}`
}
