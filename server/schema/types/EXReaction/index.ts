import { builder } from '../../builder'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/myReactions'
import './resolvers/myReaction'
import './resolvers/createReaction'
import './resolvers/updateReaction'
import './resolvers/deleteReaction'

// Export all types
export * from './inputs'

// EXReaction object type
builder.prismaObject('EXReaction', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    reflexId: t.exposeID('reflexId'),
    Reflex: t.relation('Reflex'),
    stimulus: t.exposeString('stimulus'),
    result: t.exposeString('result'),
    tokensUsed: t.exposeInt('tokensUsed', { nullable: true }),
    durationMs: t.exposeInt('durationMs', { nullable: true }),
    scoreAgent: t.exposeFloat('scoreAgent', { nullable: true }),
    scoreTarget: t.exposeFloat('scoreTarget', { nullable: true }),
    scoreMentor: t.exposeFloat('scoreMentor', { nullable: true }),
    feedback: t.exposeString('feedback', { nullable: true }),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
    relatedToUserId: t.exposeID('relatedToUserId', { nullable: true }),
  }),
})
