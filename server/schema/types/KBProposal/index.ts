import { builder } from '../../builder'

// Import enums first (before inputs that depend on them)
import './enums'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/myProposals'
import './resolvers/myProposal'
import './resolvers/createProposal'
import './resolvers/updateProposal'
import './resolvers/deleteProposal'

// Export all types
export * from './enums'
export * from './inputs'

// Import enum for use in object type
import { KBProposalStatusEnum } from './enums'

// KBProposal object type
builder.prismaObject('KBProposal', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    statement: t.exposeString('statement'),
    status: t.field({
      type: KBProposalStatusEnum,
      resolve: (parent) => parent.status,
    }),
    testedBy: t.exposeString('testedBy', { nullable: true }),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
    Decisions: t.relation('Decisions'),
  }),
})
