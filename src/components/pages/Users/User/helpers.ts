import { UserQueryVariables } from 'src/gql/generated'

export function getUserQueryVariables(
  userId: string | undefined,
): UserQueryVariables {
  return {
    where: {
      id: userId,
    },
  }
}
