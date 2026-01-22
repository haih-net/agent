import { builder } from '../../builder'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/myFactParticipations'
import './resolvers/createFactParticipation'
import './resolvers/updateFactParticipation'
import './resolvers/deleteFactParticipation'

// Export all types
export * from './inputs'

// KBFactParticipation object type
builder.prismaObject('KBFactParticipation', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    conceptId: t.exposeID('conceptId'),
    Concept: t.relation('Concept'),
    factId: t.exposeID('factId'),
    Fact: t.relation('Fact'),
    role: t.exposeString('role'),
    impact: t.exposeString('impact', { nullable: true }),
    value: t.exposeString('value', { nullable: true }),
    localImportance: t.exposeFloat('localImportance'),
  }),
})
