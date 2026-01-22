import { builder } from '../../builder'
import { KBKnowledgeSpaceType } from '@prisma/client'

export const KBKnowledgeSpaceTypeEnum = builder.enumType(
  'KBKnowledgeSpaceType',
  {
    values: Object.values(KBKnowledgeSpaceType),
  },
)
