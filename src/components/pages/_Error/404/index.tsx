import { SeoHeaders } from 'src/components/seo/SeoHeaders'

export const Page404: React.FC = () => {
  return (
    <>
      <SeoHeaders noindex nofollow title="Page not found" />
      <h2>Page not found</h2>
    </>
  )
}
