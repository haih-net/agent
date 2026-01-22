import { builder } from '../../builder'

// Import enums first (before inputs that depend on them)
import './enums'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/myDecisions'
import './resolvers/myDecision'
import './resolvers/createDecision'
import './resolvers/updateDecision'
import './resolvers/deleteDecision'

// Export all types
export * from './enums'
export * from './inputs'

// Import enum for use in object type
import { KBDecisionStatusEnum } from './enums'

// KBDecision object type
builder.prismaObject('KBDecision', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    subject: t.exposeString('subject'),
    decision: t.exposeString('decision'),
    context: t.expose('context', { type: 'Json', nullable: true }),
    outcome: t.expose('outcome', { type: 'Json', nullable: true }),
    status: t.field({
      type: KBDecisionStatusEnum,
      resolve: (parent) => parent.status,
    }),
    revisedById: t.exposeID('revisedById', { nullable: true }),
    RevisedBy: t.relation('RevisedBy', { nullable: true }),
    Revisions: t.relation('Revisions'),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
    BasedOnProposal: t.relation('BasedOnProposal', { nullable: true }),
  }),
})
