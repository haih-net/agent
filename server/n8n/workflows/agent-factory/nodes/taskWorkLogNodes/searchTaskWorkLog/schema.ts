import { TaskWorkLogListQueryVariables } from 'src/gql/generated/taskWorkLogList'
import * as yup from 'yup'

export const searchTaskWorkLogSchema: yup.ObjectSchema<TaskWorkLogListQueryVariables> =
  yup.object().shape({
    where: yup.object().shape({
      taskId: yup.string().label('Filter by task ID'),
    }),
    skip: yup.number().label('Number of records to skip'),
    take: yup.number().label('Number of records to return'),
  })
