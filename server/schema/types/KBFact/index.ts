import { builder } from '../../builder'

// Import enums first (before inputs that depend on them)
import './enums'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/myFacts'
import './resolvers/myFact'
import './resolvers/createFact'
import './resolvers/updateFact'
import './resolvers/deleteFact'

// Export all types
export * from './enums'
export * from './inputs'

// Import enum for use in object type
import { KBFactStatusEnum } from './enums'

// KBFact object type
builder.prismaObject('KBFact', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    type: t.exposeString('type'),
    statement: t.exposeString('statement'),
    validFrom: t.expose('validFrom', { type: 'DateTime', nullable: true }),
    validTo: t.expose('validTo', { type: 'DateTime', nullable: true }),
    knownSince: t.expose('knownSince', { type: 'DateTime' }),
    confidence: t.exposeFloat('confidence'),
    importance: t.exposeFloat('importance'),
    source: t.exposeString('source', { nullable: true }),
    status: t.field({
      type: KBFactStatusEnum,
      resolve: (parent) => parent.status,
    }),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
    Participations: t.relation('Participations'),
    Projections: t.relation('Projections'),
  }),
})
