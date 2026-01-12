/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentNode } from '@apollo/client'
import { graphql, GraphQLHandler, http, HttpHandler } from 'msw'
import { worker } from './msw'

export enum RequestType {
  REST = 'rest',
  GRAPHQL = 'graphql',
}

export type RestMockConfigMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

export interface RestMockConfig {
  type: RequestType.REST
  method: RestMockConfigMethod
  url: string
  response:
    | ((args: {
        request: Request
        cookies?: Record<string, string>
        params?: Record<string, unknown>
      }) => Record<string, any>)
    | Record<string, any>
  status?: number
}

export interface GraphQLRequestContext {
  operationName: string
  query: any
  variables?: Record<string, any>
}

export interface GraphQLMockConfig {
  type: RequestType.GRAPHQL
  query: DocumentNode | string
  variables?: Record<string, any>
  response: (req: GraphQLRequestContext) => {
    data: unknown
  }
}

export type MockConfig = RestMockConfig | GraphQLMockConfig

export interface MswParameters {
  msw?: {
    mocks?: MockConfig[]
  }
  apolloClient?: {
    mocks?: Array<{
      request: {
        query: any
        variables?: Record<string, any>
      }
      result: () => { data: any } | { errors: any[] }
    }>
  }
}

function getOperationName(query: any): string {
  try {
    if (query.definitions && Array.isArray(query.definitions)) {
      const operationDefinition = query.definitions.find(
        (def: any) => def.kind === 'OperationDefinition',
      )

      if (operationDefinition?.name?.value) {
        return operationDefinition.name.value
      }
    }

    return 'UnknownOperation'
  } catch (error) {
    console.error('Error getting operation name:', error)
    return 'ErrorOperation'
  }
}

function convertApolloMocksToMsw(apolloMocks: any[]): MockConfig[] {
  if (!apolloMocks || !Array.isArray(apolloMocks) || apolloMocks.length === 0) {
    return []
  }

  return apolloMocks.map((mock) => {
    const { request, result } = mock

    const mockResult = typeof result === 'function' ? result() : result

    return {
      type: RequestType.GRAPHQL,
      query: request.query,
      variables: request.variables,
      response: mockResult,
    }
  })
}

function createRestHandler(config: RestMockConfig): HttpHandler {
  const { method, url, response, status = 200 } = config

  return http[method](url, (...args) => {
    const data = typeof response === 'function' ? response(...args) : response

    return new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })
}

function createGraphQLHandler(config: GraphQLMockConfig): GraphQLHandler {
  const { query, response } = config

  const operationName =
    typeof query === 'string' ? query : getOperationName(query)

  return graphql.operation((req) => {
    if (req.operationName !== operationName) {
      return
    }

    const responseData =
      typeof response === 'function'
        ? response({
            operationName,
            query,
            variables: req.variables,
          })
        : response

    return new Response(JSON.stringify(responseData), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })
}

export function setupMswMocks(parameters: MswParameters): void {
  worker.resetHandlers()

  let allMocks: MockConfig[] = []

  if (parameters?.msw?.mocks && Array.isArray(parameters.msw.mocks)) {
    allMocks = [...allMocks, ...parameters.msw.mocks]
  }

  if (
    parameters?.apolloClient?.mocks &&
    Array.isArray(parameters.apolloClient.mocks)
  ) {
    const apolloMocks = convertApolloMocksToMsw(parameters.apolloClient.mocks)
    allMocks = [...allMocks, ...apolloMocks]
  }

  if (allMocks.length === 0) {
    return
  }

  const handlers = allMocks.map((config) => {
    switch (config.type) {
      case RequestType.REST:
        return createRestHandler(config)
      case RequestType.GRAPHQL:
        return createGraphQLHandler(config)

      default:
        console.warn('Unknown mock type:', (config as any).type)
        return http.get(
          '/__msw_unknown',
          () => new Response('Unknown mock type'),
        )
    }
  })

  worker.use(...handlers)
}
