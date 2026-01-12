import { generate } from './generateTypes'

generate().catch((err: Error) => {
  console.error(
    'Error occurred during schema generation',
    err.name,
    err.message,
  )
  process.exit(1)
})
