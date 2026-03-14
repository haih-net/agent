import { rule } from 'graphql-shield'
import { PrismaContext } from '../../../context/interfaces'

export const isActive = rule()((
  _parent: unknown,
  _args: unknown,
  ctx: PrismaContext,
) => {
  return ctx.currentUser?.status === 'active'
})
