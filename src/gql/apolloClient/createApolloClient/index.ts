import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs'
import { ErrorLink } from '@apollo/client/link/error'
import { SetContextLink } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { OperationDefinitionNode } from 'graphql'
import { createClient } from 'graphql-ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  CombinedGraphQLErrors,
  ServerError,
} from '@apollo/client'

import { typePolicies } from './typePolicies'
import { createApolloClientProps } from './interfaces'
import type { IncomingHttpHeaders } from 'http'

export * from './interfaces'

let wsLink: GraphQLWsLink | undefined

function getEndpoint() {
  let endpoint
  const origin =
    typeof window !== 'undefined' ? window.location?.origin : undefined

  if (origin && process.env.NODE_ENV !== 'test') {
    endpoint = `${origin}/api/`
  } else if (typeof window === 'undefined' && typeof require !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const os = require('os')
    const hostname = os.hostname()
    const PORT = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000
    endpoint = `http://${hostname}:${PORT}/api/`
  } else {
    endpoint = `${window.location.origin}/api/`
  }

  return endpoint
}

/**
 * Creates and returns WebSocket client for GraphQL
 */
export function getWsClient(withWs: boolean) {
  if (typeof window === 'undefined' || !withWs) {
    return undefined
  }

  const endpoint = getEndpoint()
  const wsUri = new URL(endpoint)

  let protocol = wsUri.protocol
  switch (protocol) {
    case 'http:':
      protocol = 'ws:'
      break
    case 'https:':
    default:
      protocol = 'wss:'
      break
  }

  wsUri.protocol = protocol

  return createClient({
    url: wsUri.toString(),
    connectionParams: async () => {
      const params: { Authorization?: string } = {}

      if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
          params.Authorization = `Bearer ${token}`
        }
      }

      return params
    },
  })
}

/**
 * Function for getting WebSocket connection.
 * Used for GraphQL subscriptions.
 */
export function getWsLink(withWs: boolean) {
  /**
   * On the server side we don't need WebSocket support.
   * We connect websockets only on the browser side.
   */
  if (typeof window === 'undefined') {
    return
  }

  /**
   * If client already exists, return it
   */
  if (wsLink) {
    return wsLink
  }

  const wsClient = getWsClient(withWs)

  if (wsClient) {
    wsLink = new GraphQLWsLink(wsClient)
  }

  return wsLink
}

function createApolloClient({ withWs, appContext }: createApolloClientProps) {
  const endpoint = getEndpoint()

  const errorLink = new ErrorLink(({ error }) => {
    if (CombinedGraphQLErrors.is(error)) {
      error.errors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      )
    } else if (ServerError.is(error)) {
      console.error(`[Server error]: ${error.message}`)
    } else if (error) {
      console.error(`[Network error]: ${error.message}`)
    }
  })

  const uploadLink = new UploadHttpLink({
    uri: endpoint,
  })

  const secureUploadLink = new SetContextLink((prevContext, operation) => {
    const headers = {
      ...prevContext.headers,
      'x-apollo-operation-name': operation.operationName || 'Unknown',
      'apollo-require-preflight': 'true',
    }

    return {
      headers,
    }
  }).concat(uploadLink)

  const httpLink = secureUploadLink

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers }: { headers?: IncomingHttpHeaders }) => {
      if (!headers && appContext?.ctx.req?.headers) {
        headers = { ...appContext?.ctx.req?.headers }
      }

      const token =
        (typeof globalThis !== 'undefined' && 'localStorage' in globalThis
          ? globalThis.localStorage?.getItem('token')
          : null) || null

      if (token) {
        headers = {
          ...headers,
          authorization: `Bearer ${token}`,
        }
      }

      return {
        headers,
      }
    })

    return forward(operation)
  })

  let wsHttpLink: ApolloLink = httpLink

  const wsLink = withWs ? getWsLink(withWs) : undefined

  if (wsLink) {
    wsHttpLink = ApolloLink.split(
      (request) => {
        const { query } = request

        const { kind, operation } = getMainDefinition(
          query,
        ) as OperationDefinitionNode
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      wsLink,
      httpLink,
    )
  }

  // const link = concat(authMiddleware, httpLink)
  const link = errorLink.concat(wsHttpLink)

  const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([authMiddleware, link]),
    cache: new InMemoryCache({
      /**
       * Here you can specify logic for individual object fields,
       * for example, merging data when performing lazy loading.
       */
      typePolicies,

      // https://www.apollographql.com/docs/react/data/fragments/#defining-possibletypes-manually
      possibleTypes: {
        ResourceInterface: ['Activity'],
      },
    }),
  })

  return client
}

export default createApolloClient
