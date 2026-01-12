import { builder } from 'server/schema/builder'

export const FreeCodeTimer = builder.simpleObject('FreeCodeTimer', {
  fields: (t) => ({
    id: t.id(),
    createdAt: t.field({ type: 'DateTime', nullable: true }),
    updatedAt: t.field({ type: 'DateTime', nullable: true }),
    stopedAt: t.field({ type: 'DateTime', nullable: true }),
    content: t.string({ nullable: true }),
    Task: t.string({ nullable: true }),
  }),
})

import './resolvers/timers'
import './resolvers/timer'
