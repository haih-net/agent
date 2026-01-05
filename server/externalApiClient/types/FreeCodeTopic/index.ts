import { builder } from 'server/schema/builder'

export const FreeCodeTopic = builder.simpleObject('FreeCodeTopic', {
  fields: (t) => ({
    id: t.id(),
    createdAt: t.field({ type: 'DateTime' }),
    updatedAt: t.field({ type: 'DateTime' }),
    name: t.string({ nullable: true }),
    longtitle: t.string({ nullable: true }),
    intro: t.string({ nullable: true }),
    contentV2: t.string({ nullable: true }),
    uri: t.string({ nullable: true }),
  }),
})

export const FreeCodeTopicResponse = builder.simpleObject(
  'FreeCodeTopicResponse',
  {
    fields: (t) => ({
      success: t.boolean(),
      message: t.string(),
      data: t.field({ type: FreeCodeTopic, nullable: true }),
    }),
  },
)

import './inputs'
import './resolvers/topics'
import './resolvers/topic'
import './resolvers/createTopic'
import './resolvers/updateTopic'
