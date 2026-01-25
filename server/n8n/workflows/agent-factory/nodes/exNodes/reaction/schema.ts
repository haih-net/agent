import { CreateReactionMutationVariables } from 'src/gql/generated/createReaction'
import { DeleteReactionMutationVariables } from 'src/gql/generated/deleteReaction'
import { MyReactionQueryVariables } from 'src/gql/generated/myReaction'
import { MyReactionsQueryVariables } from 'src/gql/generated/myReactions'
import { SortOrder } from 'src/gql/generated/types'
import { UpdateReactionMutationVariables } from 'src/gql/generated/updateReaction'
import * as yup from 'yup'

const sortOrderValues = Object.values(SortOrder)

export const myReactionsSchema: yup.ObjectSchema<MyReactionsQueryVariables> =
  yup.object().shape({
    where: yup.object().shape({
      reflexId: yup.string().label('Filter by reflex ID'),
      relatedToUserId: yup.string().label('Filter by related user ID'),
    }),
    orderBy: yup.object().shape({
      createdAt: yup
        .string()
        .oneOf(sortOrderValues)
        .label('Sort by creation date'),
      scoreAgent: yup
        .string()
        .oneOf(sortOrderValues)
        .label('Sort by agent score'),
      scoreTarget: yup
        .string()
        .oneOf(sortOrderValues)
        .label('Sort by target score'),
      scoreMentor: yup
        .string()
        .oneOf(sortOrderValues)
        .label('Sort by mentor score'),
    }),
    skip: yup.number().label('Number of records to skip'),
    take: yup.number().label('Number of records to return'),
  })

export const myReactionSchema: yup.ObjectSchema<MyReactionQueryVariables> = yup
  .object()
  .shape({
    id: yup.string().required().label('Reaction ID'),
  })

export const createReactionSchema: yup.ObjectSchema<CreateReactionMutationVariables> =
  yup.object().shape({
    data: yup
      .object()
      .shape({
        reflexId: yup.string().required().label('Reflex ID (required)'),
        stimulus: yup
          .string()
          .required()
          .label('Stimulus that triggered reaction (required)'),
        result: yup.string().required().label('Result description (required)'),
        tokensUsed: yup.number().label('Tokens used'),
        durationMs: yup.number().label('Duration in milliseconds'),
        scoreAgent: yup.number().label('Agent self-assessment (0-1)'),
        relatedToUserId: yup.string().label('Related user ID'),
      })
      .required(),
  })

export const updateReactionSchema: yup.ObjectSchema<UpdateReactionMutationVariables> =
  yup.object().shape({
    id: yup.string().required().label('Reaction ID to update'),
    data: yup
      .object()
      .shape({
        result: yup.string().label('New result description'),
        tokensUsed: yup.number().label('New tokens used'),
        durationMs: yup.number().label('New duration in milliseconds'),
        scoreAgent: yup.number().label('New agent self-assessment (0-1)'),
        scoreTarget: yup.number().label('Target user assessment (0-1)'),
        scoreMentor: yup.number().label('Mentor assessment (0-1)'),
        feedback: yup.string().label('Feedback comment'),
      })
      .required(),
  })

export const deleteReactionSchema: yup.ObjectSchema<DeleteReactionMutationVariables> =
  yup.object().shape({
    id: yup.string().required().label('Reaction ID to delete'),
  })

export type ReactionOperation =
  | 'myReactions'
  | 'myReaction'
  | 'createReaction'
  | 'updateReaction'
  | 'deleteReaction'

export const reactionOperations: ReactionOperation[] = [
  'myReactions',
  'myReaction',
  'createReaction',
  'updateReaction',
  'deleteReaction',
]

export const reactionSchemas = {
  myReactions: myReactionsSchema,
  myReaction: myReactionSchema,
  createReaction: createReactionSchema,
  updateReaction: updateReactionSchema,
  deleteReaction: deleteReactionSchema,
}
