import * as fs from 'fs'
import * as path from 'path'
import { generate } from './generateTypes'

const SCHEMA_FILE = path.resolve(__dirname, '../../generated/schema.json')

generate()
  .then(() => {
    if (fs.existsSync(SCHEMA_FILE)) {
      fs.unlinkSync(SCHEMA_FILE)
    }
  })
  .catch((err: Error) => {
    console.error('=== Ошибка генерации схемы ===')
    console.error('Name:', err.name)
    console.error('Message:', err.message)
    console.error('Stack:', err.stack)
    console.error('Full error:', err)
    process.exit(1)
  })
