import * as codegen from '@graphql-codegen/cli'
import path from 'path'
import { OUTPUT_PATH } from './constants'

const GRAPHQL_API_ENDPOINT = process.env.GRAPHQL_API_ENDPOINT

export const generateSchema = async () => {
  if (!GRAPHQL_API_ENDPOINT) {
    throw new Error('GRAPHQL_API_ENDPOINT environment variable is not set')
  }

  await codegen.generate(
    {
      schema: GRAPHQL_API_ENDPOINT,
      generates: {
        [path.resolve(OUTPUT_PATH, 'schema.json')]: {
          plugins: [{ introspection: {} }],
        },
      },
    },
    true,
  )
}
