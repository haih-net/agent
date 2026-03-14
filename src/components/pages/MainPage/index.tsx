import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { Page } from '../_App/interfaces'

export const MainPage: Page = () => {
  const siteTitle = process.env.NEXT_PUBLIC_MAIN_PAGE_TITLE

  return <>{siteTitle && <SeoHeaders title={siteTitle} />}</>
}
