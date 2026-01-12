import { builder } from 'server/schema/builder'

export const FreeCodeBlog = builder.simpleObject('FreeCodeBlog', {
  fields: (t) => ({
    id: t.id(),
    createdAt: t.field({ type: 'DateTime' }),
    updatedAt: t.field({ type: 'DateTime' }),
    name: t.string({ nullable: true }),
    longtitle: t.string({ nullable: true }),
    uri: t.string(),
  }),
})

import './inputs'
import './resolvers/blogs'
import './resolvers/blog'
