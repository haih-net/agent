import { MyMindLogsQueryVariables } from 'src/gql/generated/myMindLogs'
import { MindLogType } from 'src/gql/generated/types'
import * as yup from 'yup'

const mindLogTypeValues = Object.values(MindLogType)

export const searchMindLogSchema: yup.ObjectSchema<MyMindLogsQueryVariables> =
  yup.object().shape({
    where: yup
      .object()
      .shape({
        type: yup
          .object()
          .shape({
            equals: yup
              .mixed<MindLogType>()
              .oneOf(mindLogTypeValues)
              .label(`MindLog type (${mindLogTypeValues.join(', ')})`),
            in: yup
              .array()
              .of(yup.mixed<MindLogType>().oneOf(mindLogTypeValues).required())
              .label('Array of MindLog types'),
          })
          .default(undefined),
        relatedToUserId: yup.string().label('Filter by related user ID'),
      })
      .default(undefined),
    skip: yup.number().label('Number of records to skip'),
    take: yup.number().label('Number of records to return'),
  })
