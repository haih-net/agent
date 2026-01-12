import { useMindLogQuery } from 'src/gql/generated'
import { Page } from '../../_App/interfaces'
import { MindLogPageProps } from './interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { MindLogPageStyled } from './styles'
import { getMindLogQueryVariables } from '../helpers'
import { mindLogPageGetInitialProps } from './mindLogPageGetInitialProps'
import { MindLogCard } from 'src/components/MindLogCard'

export const MindLogPage: Page<MindLogPageProps> = ({ mindLogId }) => {
  const variables = getMindLogQueryVariables(mindLogId)

  const response = useMindLogQuery({
    variables,
    skip: !mindLogId,
  })

  const mindLog = response.data?.response

  if (response.loading) {
    return (
      <MindLogPageStyled>
        <p>Loading...</p>
      </MindLogPageStyled>
    )
  }

  if (!mindLog) {
    return (
      <MindLogPageStyled>
        <p>Mind log not found</p>
      </MindLogPageStyled>
    )
  }

  return (
    <>
      <SeoHeaders title={`Mind Log: ${mindLog.type}`} />
      <MindLogPageStyled>
        <MindLogCard mindLog={mindLog} />
      </MindLogPageStyled>
    </>
  )
}

MindLogPage.getInitialProps = mindLogPageGetInitialProps
