import { builder } from '../../builder'

// TaskWorkLog object type
builder.prismaObject('TaskWorkLog', {
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
import './resolvers/taskWorkLog'
import './resolvers/taskWorkLogList'
import './resolvers/createTaskWorkLog'
import './resolvers/deleteTaskWorkLog'
