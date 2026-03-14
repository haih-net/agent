import { PostsPageViewProps } from './interfaces'
import { Post } from 'src/components/Post'
import {
  PostsPageViewStyled,
  PostsPageViewTitleStyled,
  PostsPageViewListStyled,
  PostsPageViewToolbarStyled,
} from './styles'
import { Pagination } from 'src/components/Pagination'
import { Button } from 'src/ui-kit/Button'
import Link from 'next/link'

export const PostsPageView: React.FC<PostsPageViewProps> = ({
  posts,
  count,
  page,
}) => {
  const totalPages = count ? Math.floor(count / 10) + 1 : 0

  return (
    <PostsPageViewStyled>
      <PostsPageViewToolbarStyled>
        <PostsPageViewTitleStyled>Posts</PostsPageViewTitleStyled>

        <Link href="/posts/create">
          <Button>Create post</Button>
        </Link>
      </PostsPageViewToolbarStyled>

      <PostsPageViewListStyled>
        {posts.map((post) => (
          <Post key={post.id} post={post} variant="list" />
        ))}
      </PostsPageViewListStyled>

      <Pagination currentPage={page} totalPages={totalPages} />
    </PostsPageViewStyled>
  )
}
