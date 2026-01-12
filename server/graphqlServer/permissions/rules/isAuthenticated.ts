import { rule } from 'graphql-shield'
import { PrismaContext } from '../../../context/interfaces'

/**
 * User is authenticated
 */
export const isAuthenticated = rule()((
  _parent: unknown,
  _args: unknown,
  ctx: PrismaContext,
) => {
  return !!ctx.currentUser
})
