import React from 'react'
import { MindLogFragment } from 'src/gql/generated'
import { FormattedDate } from 'src/ui-kit/format/FormattedDate'
import { MindLogCardStyled } from './styles'

type MindLogCardProps = {
  mindLog: MindLogFragment
}

export const MindLogCard: React.FC<MindLogCardProps> = ({ mindLog }) => {
  return (
    <MindLogCardStyled>
      <strong>{mindLog.type}</strong>
      <span>
        <FormattedDate value={mindLog.createdAt} format="dateTimeMedium" />
      </span>
      <p>{mindLog.data}</p>
    </MindLogCardStyled>
  )
}
