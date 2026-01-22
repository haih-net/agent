import { builder } from '../../builder'

// Import enums first (before inputs that depend on them)
import './enums'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/myIdentityOperations'
import './resolvers/myIdentityOperation'
import './resolvers/createIdentityOperation'
import './resolvers/updateIdentityOperation'
import './resolvers/deleteIdentityOperation'

// Export all types
export * from './enums'
export * from './inputs'

// Import enum for use in object type
import { KBIdentityOperationTypeEnum } from './enums'

// KBIdentityOperation object type
builder.prismaObject('KBIdentityOperation', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    operation: t.field({
      type: KBIdentityOperationTypeEnum,
      resolve: (parent) => parent.operation,
    }),
    rationale: t.exposeString('rationale', { nullable: true }),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
    Inputs: t.relation('Inputs'),
    Outputs: t.relation('Outputs'),
  }),
})
