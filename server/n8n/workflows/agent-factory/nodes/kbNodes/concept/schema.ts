import * as yup from 'yup'

export const myConceptsSchema = yup.object().shape({
  where: yup.object().shape({
    name: yup.string().label('Filter by concept name (partial match)'),
    type: yup.string().label('Filter by concept type'),
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

export const myConceptSchema = yup.object().shape({
  id: yup.string().required().label('Concept ID'),
})

export const createConceptSchema = yup.object().shape({
  data: yup.object().shape({
    name: yup.string().required().label('Concept name (required)'),
    type: yup.string().label('Concept type (e.g., company, position, person)'),
    description: yup.string().label('Concept description'),
  }),
})

export const updateConceptSchema = yup.object().shape({
  id: yup.string().required().label('Concept ID to update'),
  data: yup.object().shape({
    name: yup.string().label('New concept name'),
    type: yup.string().label('New concept type'),
    description: yup.string().label('New concept description'),
  }),
})

export const deleteConceptSchema = yup.object().shape({
  id: yup.string().required().label('Concept ID to delete'),
})

export type ConceptOperation =
  | 'myConcepts'
  | 'myConcept'
  | 'createConcept'
  | 'updateConcept'
  | 'deleteConcept'

export const conceptOperations: ConceptOperation[] = [
  'myConcepts',
  'myConcept',
  'createConcept',
  'updateConcept',
  'deleteConcept',
]

export const conceptSchemas = {
  myConcepts: myConceptsSchema,
  myConcept: myConceptSchema,
  createConcept: createConceptSchema,
  updateConcept: updateConceptSchema,
  deleteConcept: deleteConceptSchema,
}
