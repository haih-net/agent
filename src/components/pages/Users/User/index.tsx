import { UserPageView } from './View'
import { UserPageProps } from './interfaces'
import { userPageGetInitialProps } from './userPageGetInitialProps'
import { getUserQueryVariables } from './helpers'
import { useUserQuery } from 'src/gql/generated'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { Page } from '../../_App/interfaces'

export const UserPage: Page<UserPageProps> = ({ userId }) => {
  const variables = getUserQueryVariables(userId)

  const response = useUserQuery({
    skip: !variables,
    variables,
  })

  const user = response.data?.object

  return user ? (
    <>
      <SeoHeaders
        title={
          [user.fullname, user.username].filter((n) => !!n).join(' | ') ||
          'Anonim'
        }
      />
      {user && <UserPageView user={user} />}
    </>
  ) : null
}

UserPage.getInitialProps = userPageGetInitialProps
