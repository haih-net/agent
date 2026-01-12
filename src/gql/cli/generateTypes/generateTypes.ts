import { generateSchema } from './schema'
import { generateTypes } from './types'

/** Generates schema and index.ts */
export const generate = async () => {
  await generateSchema()
  await generateTypes()
}
