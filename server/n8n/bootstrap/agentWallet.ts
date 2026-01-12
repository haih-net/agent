import fs from 'fs'
import path from 'path'
import { ethers } from 'ethers'
import { n8nConfig } from '../config'

const WALLETS_DIR = path.join(n8nConfig.credentialsDir, 'wallets')

export interface AgentWallet {
  address: string
  publicKey: string
  privateKey: string
}

function ensureWalletsDir(): void {
  if (!fs.existsSync(WALLETS_DIR)) {
    fs.mkdirSync(WALLETS_DIR, { recursive: true })
  }
}

export function getAgentWalletPath(agentName: string): string {
  return path.join(WALLETS_DIR, `${agentName}.json`)
}

export function loadAgentWallet(agentName: string): AgentWallet | null {
  const walletPath = getAgentWalletPath(agentName)
  if (!fs.existsSync(walletPath)) {
    return null
  }

  try {
    const content = fs.readFileSync(walletPath, 'utf-8')
    return JSON.parse(content) as AgentWallet
  } catch {
    return null
  }
}

export function saveAgentWallet(agentName: string, wallet: AgentWallet): void {
  ensureWalletsDir()
  const walletPath = getAgentWalletPath(agentName)
  fs.writeFileSync(walletPath, JSON.stringify(wallet, null, 2))
}

export function generateAgentWallet(agentName: string): AgentWallet {
  const existing = loadAgentWallet(agentName)
  if (existing) {
    return existing
  }

  const wallet = ethers.Wallet.createRandom()

  const agentWallet: AgentWallet = {
    address: wallet.address,
    publicKey: wallet.publicKey,
    privateKey: wallet.privateKey,
  }

  saveAgentWallet(agentName, agentWallet)

  return agentWallet
}

export function getOrCreateAgentWallet(agentName: string): AgentWallet {
  const existing = loadAgentWallet(agentName)
  if (existing) {
    return existing
  }
  return generateAgentWallet(agentName)
}
