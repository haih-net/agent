import * as path from 'path'
import { createAgent } from '../agent-factory'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: 'Chat Agent',
  agentDescription: 'Main chat agent. Handles user conversations.',
  agentId: 'chat-agent',
  workflowName: 'Agent: Chat',
  versionId: 'agent-chat-v7',
  credentialId: 'internal-agent-chat-cred',
  credentialName: 'Internal API - agent-chat',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-chat-webhook',
  instanceId: 'narasim-dev-agent-chat',
  model: process.env.AGENT_CHAT_MODEL || 'anthropic/claude-opus-4.5',
  hasWorkflowOutput: true,
  authFromToken: true,
  agentNodeType: 'orchestrator',
  hasWebSearchAgent: true,
})

export default [toolGraphqlRequest, agentWorkflow]
