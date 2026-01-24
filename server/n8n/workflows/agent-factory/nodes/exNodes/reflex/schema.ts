import * as yup from 'yup'

const reflexTypeValues = ['unconditional', 'conditional']
const reflexStatusValues = ['active', 'disabled', 'draft']

export const myReflexesSchema = yup.object().shape({
  where: yup.object().shape({
    type: yup
      .string()
      .oneOf(reflexTypeValues)
      .label(`Filter by type (${reflexTypeValues.join(', ')})`),
    status: yup
      .string()
      .oneOf(reflexStatusValues)
      .label(`Filter by status (${reflexStatusValues.join(', ')})`),
  }),
  orderBy: yup.object().shape({
    createdAt: yup
      .string()
      .oneOf(['asc', 'desc'])
      .label('Sort by creation date'),
    effectiveness: yup
      .string()
      .oneOf(['asc', 'desc'])
      .label('Sort by effectiveness'),
    executionRate: yup
      .string()
      .oneOf(['asc', 'desc'])
      .label('Sort by execution rate'),
  }),
  skip: yup.number().label('Number of records to skip'),
  take: yup.number().label('Number of records to return'),
})

export const myReflexSchema = yup.object().shape({
  id: yup.string().required().label('Reflex ID'),
})

export const createReflexSchema = yup.object().shape({
  data: yup.object().shape({
    stimulus: yup.string().required().label('Stimulus description (required)'),
    response: yup.string().required().label('Response description (required)'),
    type: yup
      .string()
      .oneOf(reflexTypeValues)
      .label(`Reflex type (${reflexTypeValues.join(', ')})`),
    status: yup
      .string()
      .oneOf(reflexStatusValues)
      .label(`Reflex status (${reflexStatusValues.join(', ')})`),
  }),
})

export const updateReflexSchema = yup.object().shape({
  id: yup.string().required().label('Reflex ID to update'),
  data: yup.object().shape({
    stimulus: yup.string().label('New stimulus description'),
    response: yup.string().label('New response description'),
    type: yup
      .string()
      .oneOf(reflexTypeValues)
      .label(`New type (${reflexTypeValues.join(', ')})`),
    status: yup
      .string()
      .oneOf(reflexStatusValues)
      .label(`New status (${reflexStatusValues.join(', ')})`),
    effectiveness: yup.number().label('Effectiveness score (0-1)'),
    executionRate: yup.number().label('Execution rate (0-1)'),
  }),
})

export const deleteReflexSchema = yup.object().shape({
  id: yup.string().required().label('Reflex ID to delete'),
})

export type ReflexOperation =
  | 'myReflexes'
  | 'myReflex'
  | 'createReflex'
  | 'updateReflex'
  | 'deleteReflex'

export const reflexOperations: ReflexOperation[] = [
  'myReflexes',
  'myReflex',
  'createReflex',
  'updateReflex',
  'deleteReflex',
]

export const reflexSchemas = {
  myReflexes: myReflexesSchema,
  myReflex: myReflexSchema,
  createReflex: createReflexSchema,
  updateReflex: updateReflexSchema,
  deleteReflex: deleteReflexSchema,
}
