import { builder } from 'server/schema/builder'

export const TaskStatus = builder.enumType('TaskStatus', {
  values: [
    'New',
    'Accepted',
    'Rejected',
    'Progress',
    'Paused',
    'Done',
    'Discuss',
    'Approved',
    'RevisionsRequired',
    'Completed',
  ] as const,
})

export const FreeCodeTask = builder.simpleObject('FreeCodeTask', {
  fields: (t) => ({
    id: t.id(),
    name: t.string(),
    description: t.string({ nullable: true }),
    content: t.string({ nullable: true }),
    status: t.field({ type: TaskStatus, nullable: true }),
    projectId: t.string({ nullable: true }),
    startDatePlaning: t.field({ type: 'DateTime', nullable: true }),
    endDatePlaning: t.field({ type: 'DateTime', nullable: true }),
    startDate: t.field({ type: 'DateTime', nullable: true }),
    endDate: t.field({ type: 'DateTime', nullable: true }),
    createdAt: t.field({ type: 'DateTime', nullable: true }),
    updatedAt: t.field({ type: 'DateTime', nullable: true }),
  }),
})

export const FreeCodeTaskResponse = builder.simpleObject(
  'FreeCodeTaskResponse',
  {
    fields: (t) => ({
      success: t.boolean(),
      message: t.string(),
      data: t.field({ type: FreeCodeTask, nullable: true }),
    }),
  },
)

import './resolvers/tasks'
import './resolvers/task'
import './resolvers/createTask'
import './resolvers/updateTask'
