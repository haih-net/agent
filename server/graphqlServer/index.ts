import express from 'express'
import { createServer } from 'http'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express4'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import cors from 'cors'
import { applyMiddleware } from 'graphql-middleware'
import type { Context } from 'graphql-ws'

import { schema } from '../schema'
import { createContext } from '../context'
import { permissions } from './permissions'
import { PrismaContext } from 'server/context/interfaces'

// Schema with permissions middleware
const schemaWithPermissions = applyMiddleware(schema, permissions)

export async function setupGraphqlServer(): Promise<{
  port: number
  stop: () => Promise<void>
}> {
  const desiredPort = parseInt(process.env.GRAPHQL_WS_PORT || '4000', 10)

  const app = express()

  app.use(express.json())

  const httpServer = createServer(app)

  // WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/api',
  })

  // WebSocket handler for GraphQL subscriptions
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const serverCleanup = useServer(
    {
      schema: schemaWithPermissions,
      context: async (ctx: Context) => {
        const tokenRaw =
          typeof ctx.connectionParams?.Authorization === 'string'
            ? ctx.connectionParams?.Authorization
            : undefined

        return createContext({
          req: {
            headers: {
              authorization: tokenRaw,
            },
          },
        })
      },
      onError: async (_ctx, message, errors) => {
        console.error('ws onError', message, errors)

        return errors
      },
    },
    wsServer,
  )

  const apolloServer = new ApolloServer<PrismaContext>({
    schema: schemaWithPermissions,
    introspection: true,
    includeStacktraceInErrorResponses: process.env.NODE_ENV === 'development',
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    formatError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('GraphQL Error', error)
      }
      return error
    },
  })

  // Plugin for graceful HTTP server shutdown
  apolloServer.addPlugin(ApolloServerPluginDrainHttpServer({ httpServer }))

  // Plugin for graceful WebSocket server shutdown
  apolloServer.addPlugin({
    async serverWillStart() {
      return {
        async drainServer() {
          await serverCleanup.dispose()
        },
      }
    },
  })

  await apolloServer.start()

  app.use(
    '/api',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(apolloServer, {
      context: ({ req }) => createContext({ req }),
    }),
  )

  const actualPort = await new Promise<number>((resolve, reject) => {
    httpServer.once('error', reject)

    httpServer.listen(desiredPort, () => {
      const address = httpServer.address()
      if (address && typeof address === 'object') {
        resolve(address.port)
        return
      }

      reject(new Error('Failed to determine http server port'))
    })
  })

  // eslint-disable-next-line no-console
  console.log(`🚀 GraphQL server ready at http://localhost:${actualPort}/api`)
  // eslint-disable-next-line no-console
  console.log(`🚀 WebSocket endpoint ready at ws://localhost:${actualPort}/api`)

  return {
    port: actualPort,
    stop: async () => {
      const swallowNotRunning = (err: unknown) => {
        const message = err instanceof Error ? err.message : ''
        if (
          message.includes('The server is not running') ||
          message.includes('Server is not running')
        ) {
          return
        }
        throw err
      }

      try {
        await apolloServer.stop()
      } catch (err) {
        swallowNotRunning(err)
      }

      try {
        await serverCleanup.dispose()
      } catch (err) {
        swallowNotRunning(err)
      }

      try {
        await new Promise<void>((resolve, reject) => {
          wsServer.close((err) => {
            if (err) {
              reject(err)
              return
            }
            resolve()
          })
        })
      } catch (err) {
        swallowNotRunning(err)
      }

      try {
        await new Promise<void>((resolve, reject) => {
          httpServer.close((err) => {
            if (err) {
              reject(err)
              return
            }
            resolve()
          })
        })
      } catch (err) {
        swallowNotRunning(err)
      }
    },
  }
}
