import * as codegen from '@graphql-codegen/cli'
import path from 'path'
import { schema } from '../../../../server/schema'
import { OUTPUT_PATH } from './constants'
import { printSchema } from 'graphql'

/** Функция генерирующая schema.json */
export const generateSchema = async () => {
  await codegen.generate(
    {
      // schema: path.resolve(
      //   process.cwd(),
      //   'server/nexus/generated/schema.graphql',
      // ),
      schema: printSchema(schema),
      generates: {
        [path.resolve(OUTPUT_PATH, 'schema.json')]: {
          plugins: [{ introspection: {} }],
        },
      },
    },
    true,
  )
}
