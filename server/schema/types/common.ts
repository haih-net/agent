import { builder } from '../builder'

// Common types used across KB modules
export const SortOrder = builder.enumType('SortOrder', {
  values: ['asc', 'desc'] as const,
})
