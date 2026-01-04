/* eslint-disable no-console */

import fs from 'fs'
import { externalApiQuery } from 'server/externalApiClient'
import { createContext } from 'server/context'
import { n8nConfig } from '../config'
import path from 'path'
import { n8nApiRequest } from './n8nApiRequest'

const CREDENTIALS_DIR = n8nConfig.credentialsDir

interface AgentCredentials {
  username: string
  password: string
  email?: string
  fullname?: string
}

export async function authenticateAgent(
  agentData: AgentCredentials,
): Promise<string> {
  console.log(`[bootstrap] Authenticating agent: ${agentData.username}`)

  const context = await createContext({
    req: undefined,
  })

  try {
    const { SigninDocument } =
      await import('server/externalApiClient/gql/generated')

    const signinResult = await externalApiQuery(
      SigninDocument,
      {
        data: {
          password: agentData.password,
        },
        where: {
          username: agentData.username,
        },
      },
      context,
    )

    if (signinResult.data?.signin?.success && signinResult.data.signin.token) {
      console.log(
        `[bootstrap] Agent ${agentData.username} authenticated successfully`,
      )
      return signinResult.data.signin.token
    }

    console.log(
      `[bootstrap] Agent ${agentData.username} not found, attempting registration...`,
    )

    const { SignupDocument } =
      await import('server/externalApiClient/gql/generated')

    const signupResult = await externalApiQuery(
      SignupDocument,
      {
        data: {
          username: agentData.username,
          email: agentData.email,
          password: agentData.password,
          fullname: agentData.fullname,
        },
      },
      context,
    )

    if (signupResult.data?.signup?.success && signupResult.data.signup.token) {
      console.log(
        `[bootstrap] Agent ${agentData.username} registered successfully`,
      )
      return signupResult.data.signup.token
    }

    const errorMsg =
      signupResult.data?.signup?.message ||
      signupResult.errors?.[0]?.message ||
      'Unknown error'
    throw new Error(
      `Failed to authenticate or register agent ${agentData.username}: ${errorMsg}`,
    )
  } catch (err) {
    console.error(
      `[bootstrap] Critical error authenticating agent ${agentData.username}:`,
      err,
    )
    throw err
  }
}

export async function importAgentCredentials(cookies: string): Promise<void> {
  const agentFiles = fs
    .readdirSync(CREDENTIALS_DIR)
    .filter(
      (f) =>
        f.endsWith('.json') &&
        !f.startsWith('openrouter') &&
        !f.startsWith('openai'),
    )

  if (agentFiles.length === 0) {
    return
  }

  console.log('[bootstrap] Importing agent credentials...')

  for (const file of agentFiles) {
    const filePath = path.join(CREDENTIALS_DIR, file)
    const agentName = path.basename(file, '.json')

    try {
      const agentData = JSON.parse(
        fs.readFileSync(filePath, 'utf-8'),
      ) as AgentCredentials

      if (!agentData.username || !agentData.password) {
        console.log(
          `[bootstrap] Skipping ${file}: missing username or password`,
        )
        continue
      }

      const token = await authenticateAgent(agentData)

      const credential = {
        id: `freecode-${agentName}-cred`,
        name: `FreeCode API - ${agentName}`,
        type: 'httpHeaderAuth',
        data: {
          name: 'Authorization',
          value: `Bearer ${token}`,
        },
        nodesAccess: [
          {
            nodeType: '@n8n/n8n-nodes-langchain.agent',
            date: new Date().toISOString(),
          },
        ],
      }

      await n8nApiRequest('POST', '/rest/credentials', credential, cookies)
      console.log(`[bootstrap] Imported credentials for agent: ${agentName}`)

      if (n8nConfig.DELETE_CREDENTIALS_AFTER_IMPORT) {
        fs.unlinkSync(filePath)
        console.log(`[bootstrap] Deleted: ${file}`)
      }
    } catch (err) {
      console.error(
        `[bootstrap] Failed to import agent credentials for ${file}:`,
        err,
      )
      throw err
    }
  }
}
