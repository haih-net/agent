import { PostFragment } from 'src/gql/generated'

export type PostsPageViewProps = {
  posts: PostFragment[]
  count: number
  page: number
}
