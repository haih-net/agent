import { builder } from '../../builder'

// Import enums first (before inputs that depend on them)
import './enums'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/myLabels'
import './resolvers/myLabel'
import './resolvers/createLabel'
import './resolvers/updateLabel'
import './resolvers/deleteLabel'

// Export all types
export * from './enums'
export * from './inputs'

// Import enum for use in object type
import { KBLabelRoleEnum } from './enums'

// KBLabel object type
builder.prismaObject('KBLabel', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    text: t.exposeString('text'),
    language: t.exposeString('language', { nullable: true }),
    role: t.field({
      type: KBLabelRoleEnum,
      resolve: (parent) => parent.role,
    }),
    conceptId: t.exposeID('conceptId'),
    Concept: t.relation('Concept'),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
  }),
})
