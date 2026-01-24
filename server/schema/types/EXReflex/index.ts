import { builder } from '../../builder'

// Import enums first (before inputs that depend on them)
import './enums'

// Import inputs
import './inputs'

// Import resolvers
import './resolvers/myReflexes'
import './resolvers/myReflex'
import './resolvers/createReflex'
import './resolvers/updateReflex'
import './resolvers/deleteReflex'

// Export all types
export * from './enums'
export * from './inputs'

// Import enum for use in object type
import { EXReflexTypeEnum, EXReflexStatusEnum } from './enums'

// EXReflex object type
builder.prismaObject('EXReflex', {
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    type: t.field({
      type: EXReflexTypeEnum,
      resolve: (parent) => parent.type,
    }),
    status: t.field({
      type: EXReflexStatusEnum,
      resolve: (parent) => parent.status,
    }),
    stimulus: t.exposeString('stimulus'),
    response: t.exposeString('response'),
    effectiveness: t.exposeFloat('effectiveness', { nullable: true }),
    executionRate: t.exposeFloat('executionRate', { nullable: true }),
    createdById: t.exposeID('createdById'),
    CreatedBy: t.relation('CreatedBy'),
    Reactions: t.relation('Reactions'),
  }),
})
