import { builder } from '../../builder'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/myConcepts'
import './resolvers/myConcept'
import './resolvers/createConcept'
import './resolvers/updateConcept'
import './resolvers/deleteConcept'

// Export all types
export * from './inputs'

// KBConcept object type
builder.prismaObject('KBConcept', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    type: t.exposeString('type', { nullable: true }),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    content: t.exposeString('content', { nullable: true }),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
    Labels: t.relation('Labels'),
    FactParticipations: t.relation('FactParticipations'),
    IdentityInputs: t.relation('IdentityInputs'),
    IdentityOutputs: t.relation('IdentityOutputs'),
  }),
})
