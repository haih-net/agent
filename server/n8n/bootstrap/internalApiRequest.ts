import { DocumentNode, print } from 'graphql'

const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000/api'

export async function internalApiRequest<TData, TVariables>(
  document: DocumentNode,
  variables?: TVariables,
): Promise<{ data?: TData; errors?: Array<{ message: string }> }> {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: print(document),
      variables,
    }),
  })

  return res.json()
}
