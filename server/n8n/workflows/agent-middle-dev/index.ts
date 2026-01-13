import * as path from 'path'
import { createAgent } from '../agent-factory'

const AGENT_NAME = 'Middle Developer'
const isDevelopment = process.env.NODE_ENV === 'development'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'Middle Developer agent for feature development, bug fixing, and code review.',
  agentId: 'middle-dev-agent',
  workflowName: 'Agent: Middle Developer',
  versionId: 'agent-middle-dev-v1',
  credentialId: 'freecode-agent-middle-dev-cred',
  credentialName: 'FreeCode API - agent-middle-dev',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-middle-dev-webhook',
  instanceId: 'narasim-dev-agent-middle-dev',
  model: process.env.AGENT_MIDDLE_DEV_MODEL || 'anthropic/claude-sonnet-4.5',
  hasWorkflowOutput: true,
  canExecuteCode: isDevelopment,
  workflowInputs: [
    { name: 'chatInput', type: 'string' },
    { name: 'sessionId', type: 'string' },
    { name: 'user', type: 'object' },
  ],
})

export default [toolGraphqlRequest, agentWorkflow]
