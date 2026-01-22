import { KbFactProjectionVisibility } from 'src/gql/generated/types'
import * as yup from 'yup'

const visibilityValues = Object.values(KbFactProjectionVisibility)

export const myFactProjectionsSchema = yup.object().shape({
  where: yup.object().shape({
    factId: yup.string().label('Filter by fact ID'),
    knowledgeSpaceId: yup.string().label('Filter by knowledge space ID'),
    visibility: yup
      .string()
      .oneOf(visibilityValues)
      .label(`Filter by visibility (${visibilityValues.join(', ')})`),
    trustLevel: yup.number().label('Filter by trust level (0-1)'),
    importance: yup.number().label('Filter by importance (0-1)'),
  }),
  orderBy: yup.object().shape({
    createdAt: yup
      .string()
      .oneOf(['asc', 'desc'])
      .label('Sort by creation date'),
    trustLevel: yup
      .string()
      .oneOf(['asc', 'desc'])
      .label('Sort by trust level'),
    importance: yup.string().oneOf(['asc', 'desc']).label('Sort by importance'),
  }),
  skip: yup.number().label('Number of records to skip'),
  take: yup.number().label('Number of records to return'),
})

export const myFactProjectionSchema = yup.object().shape({
  id: yup.string().required().label('Fact projection ID'),
})

export const createFactProjectionSchema = yup.object().shape({
  data: yup.object().shape({
    factId: yup.string().required().label('Fact ID (required)'),
    knowledgeSpaceId: yup
      .string()
      .required()
      .label('Knowledge space ID (required)'),
    visibility: yup
      .string()
      .oneOf(visibilityValues)
      .label(`Visibility (${visibilityValues.join(', ')})`),
    trustLevel: yup.number().label('Trust level (0-1)'),
    importance: yup.number().label('Importance (0-1)'),
    notes: yup.string().label('Notes about this projection'),
  }),
})

export const updateFactProjectionSchema = yup.object().shape({
  id: yup.string().required().label('Fact projection ID to update'),
  data: yup.object().shape({
    visibility: yup
      .string()
      .oneOf(visibilityValues)
      .label(`New visibility (${visibilityValues.join(', ')})`),
    trustLevel: yup.number().label('New trust level (0-1)'),
    importance: yup.number().label('New importance (0-1)'),
    notes: yup.string().label('New notes'),
  }),
})

export const deleteFactProjectionSchema = yup.object().shape({
  id: yup.string().required().label('Fact projection ID to delete'),
})

export type FactProjectionOperation =
  | 'myFactProjections'
  | 'myFactProjection'
  | 'createFactProjection'
  | 'updateFactProjection'
  | 'deleteFactProjection'

export const factProjectionOperations: FactProjectionOperation[] = [
  'myFactProjections',
  'myFactProjection',
  'createFactProjection',
  'updateFactProjection',
  'deleteFactProjection',
]

export const factProjectionSchemas = {
  myFactProjections: myFactProjectionsSchema,
  myFactProjection: myFactProjectionSchema,
  createFactProjection: createFactProjectionSchema,
  updateFactProjection: updateFactProjectionSchema,
  deleteFactProjection: deleteFactProjectionSchema,
}
