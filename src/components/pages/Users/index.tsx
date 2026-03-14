import { useUsersConnectionQuery } from 'src/gql/generated'
import { Page } from '../_App/interfaces'
import { UsersView } from './View'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { getUsersQueryVariables } from './helpers'
import { usersPageGetInitialProps } from './usersPageGetInitialProps'
import { UsersPageProps } from './interfaces'
import { useAppContext } from 'src/components/AppContext'
import { useMemo } from 'react'

export const UsersPage: Page<UsersPageProps> = ({ page }) => {
  const { user: currentUser } = useAppContext()

  const response = useUsersConnectionQuery({
    variables: getUsersQueryVariables({ currentUser, page }),
  })

  const users = useMemo(
    () => response.data?.users || [],
    [response.data?.users],
  )

  return (
    <>
      <SeoHeaders title="Users" />
      <UsersView
        users={users}
        page={page}
        count={response.data?.usersCount ?? 0}
      />
    </>
  )
}

UsersPage.getInitialProps = usersPageGetInitialProps
