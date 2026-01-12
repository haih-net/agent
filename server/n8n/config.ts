import path from 'path'

const PROJECT_DIR = process.cwd()

const requiredEnvs = ['N8N_ENCRYPTION_KEY']

requiredEnvs.forEach((n) => {
  if (!process.env[n]) {
    throw new Error(`"${n}" env is required`)
  }
})

const DELETE_CREDENTIALS_AFTER_IMPORT =
  process.env.N8N_DELETE_CREDENTIALS_AFTER_IMPORT === 'true'

export const n8nConfig = {
  port: (process.env.N8N_PORT && parseInt(process.env.N8N_PORT, 10)) || 5678,
  n8nUserFolder:
    process.env.N8N_USER_FOLDER || path.resolve(PROJECT_DIR, '.n8n'),
  credentialsDir: path.join(PROJECT_DIR, 'credentials'),
  DELETE_CREDENTIALS_AFTER_IMPORT,
} as const
