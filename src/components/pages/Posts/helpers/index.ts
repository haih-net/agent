import {
  PostsConnectionQueryVariables,
  PostStatus,
  UserFragment,
} from 'src/gql/generated'

type getPostsConnectionQueryVariablesProps = {
  page: number
  first?: number
  currentUser: UserFragment | null | undefined
}

export function getPostsConnectionQueryVariables({
  page,
  first = 10,
  currentUser,
}: getPostsConnectionQueryVariablesProps): PostsConnectionQueryVariables {
  return {
    where: { status: currentUser ? undefined : PostStatus.PUBLISHED },
    skip: (page - 1) * first,
  }
}
