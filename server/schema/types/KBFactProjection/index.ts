import { builder } from '../../builder'

// Import enums first (before inputs that depend on them)
import './enums'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/myFactProjections'
import './resolvers/myFactProjection'
import './resolvers/createFactProjection'
import './resolvers/updateFactProjection'
import './resolvers/deleteFactProjection'

// Export all types
export * from './enums'
export * from './inputs'

// Import enum for use in object type
import { KBFactProjectionVisibilityEnum } from './enums'

// KBFactProjection object type
builder.prismaObject('KBFactProjection', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    factId: t.exposeID('factId'),
    Fact: t.relation('Fact'),
    knowledgeSpaceId: t.exposeID('knowledgeSpaceId'),
    KnowledgeSpace: t.relation('KnowledgeSpace'),
    visibility: t.field({
      type: KBFactProjectionVisibilityEnum,
      resolve: (parent) => parent.visibility,
    }),
    trustLevel: t.exposeFloat('trustLevel'),
    importance: t.exposeFloat('importance'),
    notes: t.exposeString('notes', { nullable: true }),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
  }),
})
