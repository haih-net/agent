import { builder } from '../../builder'
import { KBFactProjectionVisibility } from '@prisma/client'

export const KBFactProjectionVisibilityEnum = builder.enumType(
  'KBFactProjectionVisibility',
  {
    values: Object.values(KBFactProjectionVisibility),
  },
)
