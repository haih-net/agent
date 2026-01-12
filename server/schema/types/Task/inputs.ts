import { builder } from '../../builder'
import { TaskStatusEnum } from './index'

export const SortOrder = builder.enumType('SortOrder', {
  values: ['asc', 'desc'] as const,
})

export const TaskOrderByInput = builder.inputType('TaskOrderByInput', {
  fields: (t) => ({
    createdAt: t.field({ type: SortOrder }),
  }),
})

export const TaskWhereUniqueInput = builder.inputType('TaskWhereUniqueInput', {
  fields: (t) => ({
    id: t.string(),
  }),
})

export const TaskWhereInput = builder.inputType('TaskWhereInput', {
  fields: (t) => ({
    status: t.field({ type: TaskStatusEnum }),
    parentId: t.string(),
    incompletedOnly: t.boolean({ defaultValue: true }),
  }),
})

export const TaskCreateInput = builder.inputType('TaskCreateInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    description: t.string(),
    content: t.string(),
    startDatePlaning: t.field({ type: 'DateTime' }),
    endDatePlaning: t.field({ type: 'DateTime' }),
    parentId: t.string(),
  }),
})

// Note: parentId is intentionally excluded from update input.
// Allowing parent change would require recursion check to prevent circular references.
// Parent can only be set at task creation time.
export const TaskUpdateInput = builder.inputType('TaskUpdateInput', {
  fields: (t) => ({
    title: t.string(),
    description: t.string(),
    content: t.string(),
    status: t.field({ type: TaskStatusEnum }),
    startDatePlaning: t.field({ type: 'DateTime' }),
    endDatePlaning: t.field({ type: 'DateTime' }),
    startDate: t.field({ type: 'DateTime' }),
    endDate: t.field({ type: 'DateTime' }),
  }),
})

export const TaskResponse = builder.simpleObject('TaskResponse', {
  fields: (t) => ({
    success: t.boolean({ nullable: false }),
    message: t.string({ nullable: false }),
  }),
})
