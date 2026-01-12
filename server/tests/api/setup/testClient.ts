import { PrismaClient } from '@prisma/client'

// Test server port (from .env.test)
const TEST_GRAPHQL_PORT = process.env.GRAPHQL_WS_PORT || '4040'
const GRAPHQL_URL = `http://localhost:${TEST_GRAPHQL_PORT}/api`

// Prisma client for direct DB access in tests
export const prisma = new PrismaClient()

type GraphqlResponse<TData> = {
  data?: TData
  errors?: Array<{ message: string }>
}

// GraphQL request helper
export async function graphqlRequest<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string,
): Promise<GraphqlResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  })

  return response.json()
}

// Cleanup helper - call manually when needed
export async function cleanupDatabase() {
  // Delete in correct order due to foreign keys
  await prisma.token.deleteMany()
  await prisma.user.deleteMany()
}
