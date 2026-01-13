import * as path from 'path'
import { createAgent } from '../agent-factory'

const AGENT_NAME = 'Junior Developer'
const isDevelopment = process.env.NODE_ENV === 'development'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'Junior Developer agent for learning, simple tasks, and code exploration.',
  agentId: 'junior-dev-agent',
  workflowName: 'Agent: Junior Developer',
  versionId: 'agent-junior-dev-v1',
  credentialId: 'freecode-agent-junior-dev-cred',
  credentialName: 'FreeCode API - agent-junior-dev',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-junior-dev-webhook',
  instanceId: 'narasim-dev-agent-junior-dev',
  model: process.env.AGENT_JUNIOR_DEV_MODEL || 'anthropic/claude-3.5-sonnet',
  hasWorkflowOutput: true,
  canExecuteCode: isDevelopment,
  workflowInputs: [
    { name: 'chatInput', type: 'string' },
    { name: 'sessionId', type: 'string' },
    { name: 'user', type: 'object' },
  ],
})

export default [toolGraphqlRequest, agentWorkflow]
