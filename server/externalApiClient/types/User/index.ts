import { builder } from 'server/schema/builder'

export const FreeCodeUser = builder.simpleObject('FreeCodeUser', {
  fields: (t) => ({
    id: t.id(),
    username: t.string({ nullable: true }),
    fullname: t.string({ nullable: true }),
    createdAt: t.field({ type: 'DateTime' }),
    intro: t.string({ nullable: true }),
    content: t.string({ nullable: true }),
    wefef: t.string({ nullable: true }),
  }),
})

import './resolvers/freeCodeUsers'
