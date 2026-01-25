import { CreateReflexMutationVariables } from 'src/gql/generated/createReflex'
import { DeleteReflexMutationVariables } from 'src/gql/generated/deleteReflex'
import { MyReflexQueryVariables } from 'src/gql/generated/myReflex'
import { MyReflexesQueryVariables } from 'src/gql/generated/myReflexes'
import {
  ExReflexStatus,
  ExReflexType,
  SortOrder,
} from 'src/gql/generated/types'
import { UpdateReflexMutationVariables } from 'src/gql/generated/updateReflex'
import * as yup from 'yup'

const reflexTypeValues = Object.values(ExReflexType)
const reflexStatusValues = Object.values(ExReflexStatus)
const sortOrderValues = Object.values(SortOrder)

export const myReflexesSchema: yup.ObjectSchema<MyReflexesQueryVariables> = yup
  .object()
  .shape({
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
        .oneOf(sortOrderValues)
        .label('Sort by creation date'),
      effectiveness: yup
        .string()
        .oneOf(sortOrderValues)
        .label('Sort by effectiveness'),
      executionRate: yup
        .string()
        .oneOf(sortOrderValues)
        .label('Sort by execution rate'),
    }),
    skip: yup.number().label('Number of records to skip'),
    take: yup.number().label('Number of records to return'),
  })

export const myReflexSchema: yup.ObjectSchema<MyReflexQueryVariables> = yup
  .object()
  .shape({
    id: yup.string().required().label('Reflex ID'),
  })

export const createReflexSchema: yup.ObjectSchema<CreateReflexMutationVariables> =
  yup.object().shape({
    data: yup
      .object()
      .shape({
        stimulus: yup
          .string()
          .required()
          .label('Stimulus description (required)'),
        response: yup
          .string()
          .required()
          .label('Response description (required)'),
        type: yup
          .string()
          .oneOf(reflexTypeValues)
          .label(`Reflex type (${reflexTypeValues.join(', ')})`),
        status: yup
          .string()
          .oneOf(reflexStatusValues)
          .label(`Reflex status (${reflexStatusValues.join(', ')})`),
      })
      .required(),
  })

export const updateReflexSchema: yup.ObjectSchema<UpdateReflexMutationVariables> =
  yup.object().shape({
    id: yup.string().required().label('Reflex ID to update'),
    data: yup
      .object()
      .shape({
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
      })
      .required(),
  })

export const deleteReflexSchema: yup.ObjectSchema<DeleteReflexMutationVariables> =
  yup.object().shape({
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
