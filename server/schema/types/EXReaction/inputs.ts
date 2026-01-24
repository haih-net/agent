import { builder } from '../../builder'
import { SortOrder } from '../common'

export const EXReactionOrderByInput = builder.inputType(
  'EXReactionOrderByInput',
  {
    fields: (t) => ({
      createdAt: t.field({ type: SortOrder }),
      scoreAgent: t.field({ type: SortOrder }),
      scoreTarget: t.field({ type: SortOrder }),
      scoreMentor: t.field({ type: SortOrder }),
    }),
  },
)

export const EXReactionWhereInput = builder.inputType('EXReactionWhereInput', {
  fields: (t) => ({
    reflexId: t.string(),
    relatedToUserId: t.string(),
  }),
})

export const EXReactionCreateInput = builder.inputType(
  'EXReactionCreateInput',
  {
    fields: (t) => ({
      reflexId: t.string({ required: true }),
      stimulus: t.string({ required: true }),
      result: t.string({ required: true }),
      tokensUsed: t.int(),
      durationMs: t.int(),
      scoreAgent: t.float(),
      relatedToUserId: t.string(),
    }),
  },
)

export const EXReactionUpdateInput = builder.inputType(
  'EXReactionUpdateInput',
  {
    fields: (t) => ({
      result: t.string(),
      tokensUsed: t.int(),
      durationMs: t.int(),
      scoreAgent: t.float(),
      scoreTarget: t.float(),
      scoreMentor: t.float(),
      feedback: t.string(),
    }),
  },
)
