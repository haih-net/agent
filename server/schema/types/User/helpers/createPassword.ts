import bcrypt from 'bcryptjs'

export const createPassword = async (password: string | null | undefined) => {
  return await bcrypt.hash(password ?? crypto.randomUUID(), 10)
}
