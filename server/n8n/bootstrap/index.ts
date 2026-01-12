/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import { n8nConfig } from '../config'
import { importWorkflows } from './importWorkflows'
import { importAgentCredentials } from './authenticateAgent'
import { n8nApiRequest } from './n8nApiRequest'

const CREDENTIALS_DIR = n8nConfig.credentialsDir

interface BootstrapEnv {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

function loadBootstrapEnv(): BootstrapEnv | null {
  const envFile = path.join(CREDENTIALS_DIR, 'bootstrap.env')
  if (!fs.existsSync(envFile)) {
    return null
  }

  const env: Record<string, string> = {}
  const content = fs.readFileSync(envFile, 'utf-8')

  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }
    const [key, ...valueParts] = trimmed.split('=')
    if (key) {
      env[key] = valueParts.join('=').replace(/^["']|["']$/g, '')
    }
  }

  if (!env.N8N_BOOTSTRAP_OWNER_EMAIL || !env.N8N_BOOTSTRAP_OWNER_PASSWORD) {
    return null
  }

  return {
    email: env.N8N_BOOTSTRAP_OWNER_EMAIL,
    password: env.N8N_BOOTSTRAP_OWNER_PASSWORD,
    firstName: env.N8N_BOOTSTRAP_OWNER_FIRSTNAME,
    lastName: env.N8N_BOOTSTRAP_OWNER_LASTNAME,
  }
}

async function isOwnerSetup(): Promise<boolean> {
  try {
    const { data } = await n8nApiRequest('GET', '/rest/settings')
    const settings = data as {
      userManagement?: { showSetupOnFirstLoad?: boolean }
    }
    return settings?.userManagement?.showSetupOnFirstLoad === false
  } catch {
    return false
  }
}

async function createOwner(env: BootstrapEnv): Promise<string | null> {
  console.log('[bootstrap] Creating owner user...')

  const { data, cookies } = await n8nApiRequest('POST', '/rest/owner/setup', {
    email: env.email,
    password: env.password,
    firstName: env.firstName || 'Admin',
    lastName: env.lastName || 'User',
  })

  const result = data as { data?: { id?: string }; id?: string }
  const id = result?.data?.id || result?.id
  if (id) {
    console.log('[bootstrap] Owner created successfully, id:', id)
    return cookies || null
  }

  console.error('[bootstrap] Failed to create owner:', data)
  return null
}

async function importCredentials(cookies: string): Promise<void> {
  const systemDir = path.join(CREDENTIALS_DIR, 'system')
  if (!fs.existsSync(systemDir)) {
    return
  }

  const credFiles = fs.readdirSync(systemDir).filter((f) => f.endsWith('.json'))

  if (credFiles.length === 0) {
    return
  }

  console.log('[bootstrap] Importing system credentials...')

  for (const file of credFiles) {
    const filePath = path.join(systemDir, file)
    console.log(`[bootstrap] Processing: ${file}`)

    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      const credentials = Array.isArray(content) ? content : [content]

      for (const cred of credentials) {
        try {
          await n8nApiRequest('POST', '/rest/credentials', cred, cookies)
          console.log(`[bootstrap] Imported credential: ${cred.name}`)
        } catch (err) {
          console.error(
            `[bootstrap] Failed to import credential ${cred.name}:`,
            err,
          )
        }
      }
    } catch (err) {
      console.error(`[bootstrap] Failed to parse ${file}:`, err)
    }
  }
}

async function cleanupCredentials(): Promise<void> {
  if (!n8nConfig.DELETE_CREDENTIALS_AFTER_IMPORT) {
    return
  }

  const keepFiles = ['.gitignore', 'README.md']

  console.log('[bootstrap] Cleaning up credentials directory...')

  if (!fs.existsSync(CREDENTIALS_DIR)) {
    return
  }

  const entries = fs.readdirSync(CREDENTIALS_DIR, { withFileTypes: true })

  for (const entry of entries) {
    if (keepFiles.includes(entry.name)) {
      continue
    }

    const entryPath = path.join(CREDENTIALS_DIR, entry.name)

    try {
      if (entry.isDirectory()) {
        fs.rmSync(entryPath, { recursive: true })
        console.log(`[bootstrap] Deleted directory: ${entry.name}`)
      } else {
        fs.unlinkSync(entryPath)
        console.log(`[bootstrap] Deleted file: ${entry.name}`)
      }
    } catch (err) {
      console.error(`[bootstrap] Failed to delete ${entry.name}:`, err)
    }
  }
}

async function loginOwner(env: BootstrapEnv): Promise<string | null> {
  const { cookies } = await n8nApiRequest('POST', '/rest/login', {
    email: env.email,
    password: env.password,
  })
  return cookies || null
}

export async function runBootstrap(): Promise<void> {
  console.log('[bootstrap] Starting...')

  const env = loadBootstrapEnv()
  if (!env) {
    console.log('[bootstrap] No bootstrap.env found, skipping')
    return
  }

  const ownerExists = await isOwnerSetup()
  let cookies: string | null = null

  if (ownerExists) {
    console.log('[bootstrap] Owner exists, logging in...')
    cookies = await loginOwner(env)
  } else {
    console.log('[bootstrap] Creating owner...')
    cookies = await createOwner(env)
  }

  if (!cookies) {
    console.error('[bootstrap] Failed to get auth cookies')
    return
  }

  await importCredentials(cookies)
  await importAgentCredentials(cookies)
  await importWorkflows(cookies)
  await cleanupCredentials()

  console.log('[bootstrap] Completed')
}
