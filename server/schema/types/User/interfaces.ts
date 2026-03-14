import { SignOptions } from 'jsonwebtoken'

export const REFERRER_TOKEN_TTL = (process.env.REFERRER_TOKEN_TTL ||
  '1H') as SignOptions['expiresIn']

export interface ReferrerTokenPayload {
  userId: string
  type: 'referrer'
}

export enum SignupStrategy {
  ANY = 'ANY',
}

export const signupStrategy = process.env.NEXT_PUBLIC_SITE_SIGNUP_STRATEGY
