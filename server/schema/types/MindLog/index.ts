import { builder } from '../../builder'

// MindLogType enum
export const MindLogType = builder.enumType('MindLogType', {
  values: [
    'Stimulus',
    'Reaction',
    'Action',
    'Error',
    'Result',
    'Conclusion',
    'Evaluation',
    'Correction',
    'Knowledge',
    'Identity',
    'Context',
    'Relationship',
  ] as const,
})

// MindLog object type
builder.prismaObject('MindLog', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    type: t.expose('type', { type: MindLogType }),
    data: t.exposeString('data'),
    quality: t.exposeFloat('quality', { nullable: true }),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
    relatedToUserId: t.exposeID('relatedToUserId', { nullable: true }),
  }),
})

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/mindLog'
import './resolvers/mindLogs'
import './resolvers/mindLogsCount'
import './resolvers/myMindLog'
import './resolvers/myMindLogs'
import './resolvers/myMindLogsCount'
import './resolvers/createMindLog'
import './resolvers/updateMindLog'
import './resolvers/deleteMindLog'
