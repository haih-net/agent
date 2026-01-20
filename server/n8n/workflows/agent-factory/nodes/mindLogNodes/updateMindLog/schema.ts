import { UpdateMindLogMutationVariables } from 'src/gql/generated/updateMindLog'
import * as yup from 'yup'

export const updateMindLogSchema: yup.ObjectSchema<UpdateMindLogMutationVariables> =
  yup.object().shape({
    where: yup.object().shape({
      id: yup.string().label('MindLog ID to update'),
    }),
    data: yup.object().shape({
      data: yup.string().label('Updated content'),
      quality: yup.number().label('Quality score 0-1'),
    }),
  })
