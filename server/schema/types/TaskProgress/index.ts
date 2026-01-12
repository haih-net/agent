import { builder } from '../../builder'

// TaskProgress object type
builder.prismaObject('TaskProgress', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    content: t.exposeString('content'),
    taskId: t.exposeID('taskId'),
    Task: t.relation('Task'),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
  }),
})

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/taskProgress'
import './resolvers/taskProgressList'
import './resolvers/createTaskProgress'
import './resolvers/deleteTaskProgress'
