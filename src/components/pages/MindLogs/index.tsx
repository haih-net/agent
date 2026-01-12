import { useMindLogsWithCountQuery } from 'src/gql/generated'
import { Page } from '../_App/interfaces'
import { MindLogsView } from './View'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { getMindLogsWithCountQueryVariables } from './helpers'
import { mindLogsPageGetInitialProps } from './mindLogsPageGetInitialProps'
import { MindLogsPageProps } from './interfaces'

const PAGE_SIZE = 20

export const MindLogsPage: Page<MindLogsPageProps> = ({ page }) => {
  const variables = getMindLogsWithCountQueryVariables(page, PAGE_SIZE)

  const response = useMindLogsWithCountQuery({
    variables,
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
  })

  const mindLogs = response.data?.mindLogs || []
  const totalCount = response.data?.mindLogsCount || 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <>
      <SeoHeaders title="Mind Logs" />
      <MindLogsView
        mindLogs={mindLogs}
        loading={response.loading}
        currentPage={page}
        totalPages={totalPages}
      />
    </>
  )
}

MindLogsPage.getInitialProps = mindLogsPageGetInitialProps
