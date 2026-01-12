import { generateSchema } from './schema'
import { generateTypes } from './types'

/** Генерирует схему и index.ts */
export const generate = async () => {
  await generateSchema()
  await generateTypes()
}
