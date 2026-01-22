import { builder } from '../../builder'

// Import enums first (before inputs that depend on them)
import './enums'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/myConflicts'
import './resolvers/myConflict'
import './resolvers/createConflict'
import './resolvers/updateConflict'
import './resolvers/deleteConflict'

// Export all types
export * from './enums'
export * from './inputs'

// Import enum for use in object type
import { KBConflictStatusEnum } from './enums'

// KBConflictFact junction table object type
builder.prismaObject('KBConflictFact', {
  fields: (t) => ({
    conflictId: t.exposeID('conflictId'),
    Conflict: t.relation('Conflict'),
    factId: t.exposeID('factId'),
    Fact: t.relation('Fact'),
  }),
})

// KBConflict object type
builder.prismaObject('KBConflict', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    type: t.exposeString('type'),
    severity: t.exposeString('severity'),
    status: t.field({
      type: KBConflictStatusEnum,
      resolve: (parent) => parent.status,
    }),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
    constraintId: t.exposeID('constraintId', { nullable: true }),
    Constraint: t.relation('Constraint', { nullable: true }),
    Facts: t.relation('Facts'),
  }),
})
