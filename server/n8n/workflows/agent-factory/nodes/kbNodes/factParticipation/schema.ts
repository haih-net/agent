import * as yup from 'yup'

export const myFactParticipationsSchema = yup.object().shape({
  where: yup.object().shape({
    factId: yup.string().label('Filter by fact ID'),
    conceptId: yup.string().label('Filter by concept ID'),
    role: yup
      .string()
      .label('Filter by role (e.g., subject, object, affected_party)'),
    impact: yup.string().label('Filter by impact'),
  }),
  orderBy: yup.object().shape({
    createdAt: yup
      .string()
      .oneOf(['asc', 'desc'])
      .label('Sort by creation date'),
    role: yup.string().oneOf(['asc', 'desc']).label('Sort by role'),
  }),
  skip: yup.number().label('Number of records to skip'),
  take: yup.number().label('Number of records to return'),
})

export const createFactParticipationSchema = yup.object().shape({
  data: yup.object().shape({
    factId: yup.string().required().label('Fact ID (required)'),
    conceptId: yup.string().required().label('Concept ID (required)'),
    role: yup
      .string()
      .required()
      .label(
        'Role in the fact (required, e.g., subject, object, affected_party)',
      ),
    impact: yup.string().label('Impact description'),
    value: yup.string().label('Value associated with participation'),
    localImportance: yup
      .number()
      .label('Local importance of this participation (0-1)'),
  }),
})

export const updateFactParticipationSchema = yup.object().shape({
  id: yup.string().required().label('Fact participation ID to update'),
  data: yup.object().shape({
    role: yup.string().label('New role'),
    impact: yup.string().label('New impact description'),
    value: yup.string().label('New value'),
    localImportance: yup.number().label('New local importance (0-1)'),
  }),
})

export const deleteFactParticipationSchema = yup.object().shape({
  id: yup.string().required().label('Fact participation ID to delete'),
})

export type FactParticipationOperation =
  | 'myFactParticipations'
  | 'createFactParticipation'
  | 'updateFactParticipation'
  | 'deleteFactParticipation'

export const factParticipationOperations: FactParticipationOperation[] = [
  'myFactParticipations',
  'createFactParticipation',
  'updateFactParticipation',
  'deleteFactParticipation',
]

export const factParticipationSchemas = {
  myFactParticipations: myFactParticipationsSchema,
  createFactParticipation: createFactParticipationSchema,
  updateFactParticipation: updateFactParticipationSchema,
  deleteFactParticipation: deleteFactParticipationSchema,
}
