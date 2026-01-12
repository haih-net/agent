import { builder } from '../../builder'

// User object type
builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    image: t.exposeString('image'),
    content: t.exposeString('content'),
    username: t.exposeString('username', { nullable: true }),
    fullname: t.exposeString('fullname', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
})

// Import inputs (registers them with builder)
import './inputs'

// Import resolvers
import './resolvers/users'
import './resolvers/usersCount'
import './resolvers/user'
import './resolvers/me'
import './resolvers/signup'
import './resolvers/signin'
import './resolvers/updateCurrentUser'
