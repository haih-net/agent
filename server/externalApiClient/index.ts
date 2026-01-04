import { print } from 'graphql'
import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { PrismaContext } from 'server/context/interfaces'

if (!process.env.GRAPHQL_API_ENDPOINT) {
  throw new Error('GRAPHQL_API_ENDPOINT environment variable is required')
}

const GRAPHQL_API_ENDPOINT = process.env.GRAPHQL_API_ENDPOINT

type GraphQLResponse<T> = {
  data?: T
  errors?: Array<{ message: string; path?: string[] }>
}

export async function externalApiQuery<TData, TVariables>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables | null,
  ctx: PrismaContext,
): Promise<GraphQLResponse<TData>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const authorization = ctx.req?.headers.authorization

  if (authorization) {
    headers['Authorization'] = authorization
  }

  const response = await fetch(GRAPHQL_API_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: print(document),
      variables: variables || {},
    }),
  })

  if (!response.ok) {
    if (process.env.NODE_ENV === 'development') {
      console.error(response)
    }

    throw new Error(
      `External API request failed: ${response.status} ${response.statusText}`,
    )
  }

  const result = (await response.json()) as GraphQLResponse<TData>
  return result
}
