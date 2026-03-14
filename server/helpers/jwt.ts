if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET env is empty')
}

export const JWT_SECRET = process.env.JWT_SECRET

export const JWT_TYPE_REFERRER = 'referrer'
