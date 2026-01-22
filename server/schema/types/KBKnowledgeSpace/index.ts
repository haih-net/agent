import { builder } from '../../builder'

// Import enums first (before inputs that depend on them)
import './enums'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/myKnowledgeSpaces'
import './resolvers/myKnowledgeSpace'
import './resolvers/createKnowledgeSpace'
import './resolvers/updateKnowledgeSpace'
import './resolvers/deleteKnowledgeSpace'

// Export all types
export * from './enums'
export * from './inputs'

// Import enum for use in object type
import { KBKnowledgeSpaceTypeEnum } from './enums'

// KBKnowledgeSpace object type
builder.prismaObject('KBKnowledgeSpace', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    type: t.field({
      type: KBKnowledgeSpaceTypeEnum,
      resolve: (parent) => parent.type,
    }),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
    FactProjections: t.relation('FactProjections'),
  }),
})
