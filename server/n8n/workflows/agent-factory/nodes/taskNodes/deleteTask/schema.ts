import { DeleteTaskMutationVariables } from 'src/gql/generated/deleteTask'
import * as yup from 'yup'

export const deleteTaskSchema: yup.ObjectSchema<DeleteTaskMutationVariables> =
  yup.object().shape({
    where: yup.object().shape({
      id: yup.string().label('Task ID to delete'),
    }),
  })
