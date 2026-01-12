import { shield, type IRules } from 'graphql-shield'
// import { isAuthenticated } from './rules/isAuthenticated'

import type { Mutation, Query, User } from 'src/gql/generated/types'

type UnwrapType<T> = T extends (infer U)[]
  ? UnwrapType<U>
  : T extends null | undefined
    ? never
    : T

type IsGqlObjectType<T> =
  UnwrapType<T> extends { __typename?: unknown } ? true : false

type RuleFields<T> = Partial<
  Record<keyof Omit<T, '__typename'> & string, IRules>
>

type RuleTreeKeys<T> = keyof Omit<T, '__typename'> & string

type RuleTreeRule<T> =
  IsGqlObjectType<T> extends true ? IRules | RuleFields<UnwrapType<T>> : IRules

type RuleTree<T> = Partial<
  Record<RuleTreeKeys<T>, RuleTreeRule<T[RuleTreeKeys<T>]>>
>

type ExtraPermissionTypes = {
  User: User
}

type PermissionsRuleTree = {
  Query: RuleTree<Query>
  Mutation: RuleTree<Mutation>
} & {
  [K in keyof ExtraPermissionTypes]?: RuleTree<ExtraPermissionTypes[K]> | IRules
}

const ruleTree = {
  Query: {},
  Mutation: {
    // Example: require authentication for specific mutations
    // someProtectedMutation: isAuthenticated,
  },
} satisfies PermissionsRuleTree

export const permissions = shield(ruleTree, {
  /**
   * Allow use new Error() in resolvers
   */
  allowExternalErrors: true,
})
