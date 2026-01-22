import { KbKnowledgeSpaceType } from 'src/gql/generated/types'
import * as yup from 'yup'

const knowledgeSpaceTypeValues = Object.values(KbKnowledgeSpaceType)

export const myKnowledgeSpacesSchema = yup.object().shape({
  where: yup.object().shape({
    name: yup.string().label('Filter by space name'),
    type: yup
      .string()
      .oneOf(knowledgeSpaceTypeValues)
      .label(`Filter by type (${knowledgeSpaceTypeValues.join(', ')})`),
  }),
  orderBy: yup.object().shape({
    createdAt: yup
      .string()
      .oneOf(['asc', 'desc'])
      .label('Sort by creation date'),
    name: yup.string().oneOf(['asc', 'desc']).label('Sort by name'),
    type: yup.string().oneOf(['asc', 'desc']).label('Sort by type'),
  }),
  skip: yup.number().label('Number of records to skip'),
  take: yup.number().label('Number of records to return'),
})

export const myKnowledgeSpaceSchema = yup.object().shape({
  id: yup.string().required().label('Knowledge space ID'),
})

export const createKnowledgeSpaceSchema = yup.object().shape({
  data: yup.object().shape({
    name: yup.string().required().label('Knowledge space name (required)'),
    type: yup
      .string()
      .oneOf(knowledgeSpaceTypeValues)
      .label(`Space type (${knowledgeSpaceTypeValues.join(', ')})`),
    description: yup.string().label('Space description'),
  }),
})

export const updateKnowledgeSpaceSchema = yup.object().shape({
  id: yup.string().required().label('Knowledge space ID to update'),
  data: yup.object().shape({
    name: yup.string().label('New space name'),
    type: yup
      .string()
      .oneOf(knowledgeSpaceTypeValues)
      .label(`New space type (${knowledgeSpaceTypeValues.join(', ')})`),
    description: yup.string().label('New space description'),
  }),
})

export const deleteKnowledgeSpaceSchema = yup.object().shape({
  id: yup.string().required().label('Knowledge space ID to delete'),
})

export type KnowledgeSpaceOperation =
  | 'myKnowledgeSpaces'
  | 'myKnowledgeSpace'
  | 'createKnowledgeSpace'
  | 'updateKnowledgeSpace'
  | 'deleteKnowledgeSpace'

export const knowledgeSpaceOperations: KnowledgeSpaceOperation[] = [
  'myKnowledgeSpaces',
  'myKnowledgeSpace',
  'createKnowledgeSpace',
  'updateKnowledgeSpace',
  'deleteKnowledgeSpace',
]

export const knowledgeSpaceSchemas = {
  myKnowledgeSpaces: myKnowledgeSpacesSchema,
  myKnowledgeSpace: myKnowledgeSpaceSchema,
  createKnowledgeSpace: createKnowledgeSpaceSchema,
  updateKnowledgeSpace: updateKnowledgeSpaceSchema,
  deleteKnowledgeSpace: deleteKnowledgeSpaceSchema,
}
