import { KbFactStatus } from 'src/gql/generated/types'
import * as yup from 'yup'

const factStatusValues = Object.values(KbFactStatus)

export const myFactsSchema = yup.object().shape({
  where: yup.object().shape({
    type: yup.string().label('Filter by fact type'),
    status: yup
      .string()
      .oneOf(factStatusValues)
      .label(`Filter by status (${factStatusValues.join(', ')})`),
    confidence: yup.number().label('Filter by confidence level (0-1)'),
    importance: yup.number().label('Filter by importance level (0-1)'),
    validFrom: yup.date().label('Filter by valid from date'),
    validTo: yup.date().label('Filter by valid to date'),
  }),
  orderBy: yup.object().shape({
    createdAt: yup
      .string()
      .oneOf(['asc', 'desc'])
      .label('Sort by creation date'),
    confidence: yup.string().oneOf(['asc', 'desc']).label('Sort by confidence'),
    importance: yup.string().oneOf(['asc', 'desc']).label('Sort by importance'),
    validFrom: yup
      .string()
      .oneOf(['asc', 'desc'])
      .label('Sort by valid from date'),
  }),
  skip: yup.number().label('Number of records to skip'),
  take: yup.number().label('Number of records to return'),
})

export const myFactSchema = yup.object().shape({
  id: yup.string().required().label('Fact ID'),
})

export const createFactSchema = yup.object().shape({
  data: yup.object().shape({
    statement: yup.string().required().label('Fact statement (required)'),
    type: yup.string().required().label('Fact type (required)'),
    confidence: yup.number().label('Confidence level (0-1)'),
    importance: yup.number().label('Importance level (0-1)'),
    source: yup.string().label('Source of the fact'),
    status: yup
      .string()
      .oneOf(factStatusValues)
      .label(`Fact status (${factStatusValues.join(', ')})`),
    validFrom: yup.date().label('Valid from date (ISO format)'),
    validTo: yup.date().label('Valid to date (ISO format)'),
  }),
})

export const updateFactSchema = yup.object().shape({
  id: yup.string().required().label('Fact ID to update'),
  data: yup.object().shape({
    statement: yup.string().label('New fact statement'),
    type: yup.string().label('New fact type'),
    confidence: yup.number().label('New confidence level (0-1)'),
    importance: yup.number().label('New importance level (0-1)'),
    source: yup.string().label('New source'),
    status: yup
      .string()
      .oneOf(factStatusValues)
      .label(`New status (${factStatusValues.join(', ')})`),
    validFrom: yup.date().label('New valid from date (ISO format)'),
    validTo: yup.date().label('New valid to date (ISO format)'),
  }),
})

export const deleteFactSchema = yup.object().shape({
  id: yup.string().required().label('Fact ID to delete'),
})

export type FactOperation =
  | 'myFacts'
  | 'myFact'
  | 'createFact'
  | 'updateFact'
  | 'deleteFact'

export const factOperations: FactOperation[] = [
  'myFacts',
  'myFact',
  'createFact',
  'updateFact',
  'deleteFact',
]

export const factSchemas = {
  myFacts: myFactsSchema,
  myFact: myFactSchema,
  createFact: createFactSchema,
  updateFact: updateFactSchema,
  deleteFact: deleteFactSchema,
}
