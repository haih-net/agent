import { builder } from '../../builder'

import { TaskStatus } from '@prisma/client'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/myTasks'
import './resolvers/tasks'
import './resolvers/myTasksCount'
import './resolvers/tasksCount'
import './resolvers/task'
import './resolvers/createTask'
import './resolvers/updateTask'
import './resolvers/deleteTask'

// TaskStatus enum
export const TaskStatusEnum = builder.enumType('TaskStatusEnum', {
  values: Object.values(TaskStatus),
})

// Task object type
builder.prismaObject('Task', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    title: t.exposeString('title'),
    description: t.exposeString('description', { nullable: true }),
    content: t.exposeString('content', { nullable: true }),
    status: t.expose('status', { type: TaskStatusEnum }),
    startDatePlaning: t.expose('startDatePlaning', {
      type: 'DateTime',
      nullable: true,
    }),
    endDatePlaning: t.expose('endDatePlaning', {
      type: 'DateTime',
      nullable: true,
    }),
    startDate: t.expose('startDate', { type: 'DateTime', nullable: true }),
    endDate: t.expose('endDate', { type: 'DateTime', nullable: true }),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
    assigneeId: t.exposeID('assigneeId', { nullable: true }),
    Assignee: t.relation('Assignee', { nullable: true }),
    parentId: t.exposeID('parentId', { nullable: true }),
    Parent: t.relation('Parent', { nullable: true }),
    Children: t.relation('Children'),
  }),
})
