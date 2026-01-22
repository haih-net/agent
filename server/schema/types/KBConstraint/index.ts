import { builder } from '../../builder'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/myConstraints'
import './resolvers/myConstraint'
import './resolvers/createConstraint'
import './resolvers/updateConstraint'
import './resolvers/deleteConstraint'

// Export all types
export * from './inputs'

// KBConstraint object type
builder.prismaObject('KBConstraint', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    constraint: t.exposeString('constraint'),
    scope: t.expose('scope', { type: 'Json', nullable: true }),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
    Conflicts: t.relation('Conflicts'),
  }),
})
