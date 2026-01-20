import { CreateMindLogMutationVariables } from 'src/gql/generated/createMindLog'
import { MindLogType } from 'src/gql/generated/types'
import * as yup from 'yup'

const mindLogTypeValues = Object.values(MindLogType)

export const createMindLogSchema: yup.ObjectSchema<CreateMindLogMutationVariables> =
  yup.object().shape({
    data: yup.object().shape({
      type: yup
        .string()
        .oneOf(mindLogTypeValues)
        .required()
        .label(`MindLog type (${mindLogTypeValues.join(', ')})`),
      data: yup.string().required().label('Content to save'),
      quality: yup.number().label('Quality score 0-1'),
      relatedToUserId: yup.string().label('User ID for Relationship type'),
    }),
  })
