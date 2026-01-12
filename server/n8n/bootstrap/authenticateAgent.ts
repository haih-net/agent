/* eslint-disable no-console */

import fs from 'fs'
import path from 'path'
import { n8nConfig } from '../config'
import { n8nApiRequest } from './n8nApiRequest'
import { internalApiRequest } from './internalApiRequest'
import {
  SigninDocument,
  SigninMutation,
  SigninMutationVariables,
  SignupDocument,
  SignupMutation,
  SignupMutationVariables,
} from 'src/gql/generated'

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

  try {
    const signinResult = await internalApiRequest<
      SigninMutation,
      SigninMutationVariables
    >(SigninDocument, {
      data: {
        password: agentData.password,
      },
      where: {
        username: agentData.username,
      },
    })

    if (
      signinResult.data?.response?.success &&
      signinResult.data.response.token
    ) {
      console.log(
        `[bootstrap] Agent ${agentData.username} authenticated successfully`,
      )
      return signinResult.data.response.token
    }

    console.log(
      `[bootstrap] Agent ${agentData.username} not found, attempting registration...`,
    )

    const signupResult = await internalApiRequest<
      SignupMutation,
      SignupMutationVariables
    >(SignupDocument, {
      data: {
        username: agentData.username,
        email: agentData.email,
        password: agentData.password,
        fullname: agentData.fullname,
      },
    })

    if (
      signupResult.data?.response?.success &&
      signupResult.data.response.token
    ) {
      console.log(
        `[bootstrap] Agent ${agentData.username} registered successfully`,
      )
      return signupResult.data.response.token
    }

    const errorMsg =
      signupResult.data?.response?.message ||
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
  const agentsDir = path.join(CREDENTIALS_DIR, 'agents')
  if (!fs.existsSync(agentsDir)) {
    return
  }

  const agentFiles = fs
    .readdirSync(agentsDir)
    .filter((f) => f.endsWith('.json'))

  if (agentFiles.length === 0) {
    return
  }

  console.log('[bootstrap] Importing agent credentials...')

  for (const file of agentFiles) {
    const filePath = path.join(agentsDir, file)
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
        id: `internal-${agentName}-cred`,
        name: `Internal API - ${agentName}`,
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
    } catch (err) {
      console.error(
        `[bootstrap] Failed to import agent credentials for ${file}:`,
        err,
      )
      throw err
    }
  }
}
