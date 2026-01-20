import { DeleteMindLogMutationVariables } from 'src/gql/generated/deleteMindLog'
import * as yup from 'yup'

export const deleteMindLogSchema: yup.ObjectSchema<DeleteMindLogMutationVariables> =
  yup.object().shape({
    where: yup.object().shape({
      id: yup.string().label('MindLog ID to delete'),
    }),
  })
