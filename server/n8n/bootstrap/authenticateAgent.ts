/* eslint-disable no-console */

import fs from 'fs'
import path from 'path'
import { n8nConfig } from '../config'
import { n8nApiRequest } from './n8nApiRequest'
import { getOrCreateAgentWallet, AgentWallet } from './agentWallet'

const CREDENTIALS_DIR = n8nConfig.credentialsDir

export async function bootstrapAgentWallets(): Promise<
  Map<string, AgentWallet>
> {
  const agentsDir = path.join(CREDENTIALS_DIR, 'agents')
  const wallets = new Map<string, AgentWallet>()

  if (!fs.existsSync(agentsDir)) {
    fs.mkdirSync(agentsDir, { recursive: true })
  }

  const agentFiles = fs
    .readdirSync(agentsDir)
    .filter((f) => f.endsWith('.json'))

  if (agentFiles.length === 0) {
    console.log('[bootstrap] No agent configs found, skipping wallet creation')
    return wallets
  }

  console.log('[bootstrap] Creating agent wallets...')

  for (const file of agentFiles) {
    const agentName = path.basename(file, '.json')

    try {
      const wallet = getOrCreateAgentWallet(agentName)
      wallets.set(agentName, wallet)
      console.log(`[bootstrap] Agent ${agentName} wallet: ${wallet.address}`)
    } catch (err) {
      console.error(
        `[bootstrap] Failed to create wallet for ${agentName}:`,
        err,
      )
    }
  }

  return wallets
}

export async function importAgentCredentials(cookies: string): Promise<void> {
  const wallets = await bootstrapAgentWallets()

  if (wallets.size === 0) {
    return
  }

  console.log('[bootstrap] Importing agent wallet credentials to n8n...')

  for (const [agentName, wallet] of wallets) {
    try {
      const credential = {
        id: `agent-wallet-${agentName}`,
        name: `Agent Wallet - ${agentName}`,
        type: 'httpHeaderAuth',
        data: {
          name: 'X-Agent-Address',
          value: wallet.address,
        },
        nodesAccess: [
          {
            nodeType: '@n8n/n8n-nodes-langchain.agent',
            date: new Date().toISOString(),
          },
        ],
      }

      await n8nApiRequest('POST', '/rest/credentials', credential, cookies)
      console.log(`[bootstrap] Imported wallet credential for: ${agentName}`)
    } catch (err) {
      console.error(
        `[bootstrap] Failed to import wallet credential for ${agentName}:`,
        err,
      )
    }
  }
}
