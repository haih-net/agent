import { Page } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { PostEditForm } from '../Form'

export const PostCreatePage: Page = () => {
  return (
    <>
      <SeoHeaders title="Create post" noindex nofollow />

      <PostEditForm
        post={undefined}
        cancelHandler={undefined}
        parentId={undefined}
      />
    </>
  )
}
