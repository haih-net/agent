import { CreateTaskWorkLogMutationVariables } from 'src/gql/generated/createTaskWorkLog'
import * as yup from 'yup'

export const createTaskWorkLogSchema: yup.ObjectSchema<CreateTaskWorkLogMutationVariables> =
  yup.object().shape({
    data: yup.object().shape({
      taskId: yup.string().required().label('Task ID'),
      content: yup.string().required().label('Work log content'),
    }),
  })
