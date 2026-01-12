import type { CodegenConfig } from '@graphql-codegen/cli'
import { printSchema } from 'graphql'

import { schema } from './server/schema'

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: ['src/gql/**/*.graphql'],
  generates: {
    'src/gql/generated/': {
      preset: 'client',
      plugins: [],
    },
  },
}

export default config
