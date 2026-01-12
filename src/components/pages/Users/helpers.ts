import { UsersConnectionQueryVariables } from 'src/gql/generated'

export function getUsersQueryVariables(
  first: number = 20,
): UsersConnectionQueryVariables {
  return {
    first,
  }
}
