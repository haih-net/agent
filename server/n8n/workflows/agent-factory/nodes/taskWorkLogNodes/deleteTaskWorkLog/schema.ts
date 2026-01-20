import { DeleteTaskWorkLogMutationVariables } from 'src/gql/generated/deleteTaskWorkLog'
import * as yup from 'yup'

export const deleteTaskWorkLogSchema: yup.ObjectSchema<DeleteTaskWorkLogMutationVariables> =
  yup.object().shape({
    where: yup.object().shape({
      id: yup.string().required().label('Work log ID to delete'),
    }),
  })
