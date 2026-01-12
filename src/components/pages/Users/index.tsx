import { useUsersConnectionQuery } from 'src/gql/generated'
import { Page } from '../_App/interfaces'
import { UsersView } from './View'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { getUsersQueryVariables } from './helpers'
import { usersPageGetInitialProps } from './usersPageGetInitialProps'

export const UsersPage: Page = () => {
  const variables = getUsersQueryVariables()

  const response = useUsersConnectionQuery({
    variables,
    fetchPolicy: 'cache-and-network',
  })

  const users = response.data?.users || []

  return (
    <>
      <SeoHeaders title="Users" />
      <UsersView users={users} loading={response.loading} />
    </>
  )
}

UsersPage.getInitialProps = usersPageGetInitialProps
