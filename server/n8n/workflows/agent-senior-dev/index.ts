import * as path from 'path'
import { createAgent } from '../agent-factory'

const AGENT_NAME = 'Senior Developer'
const isDevelopment = process.env.NODE_ENV === 'development'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'Senior Developer agent for system design, complex problem solving, and technical leadership.',
  agentId: 'senior-dev-agent',
  workflowName: 'Agent: Senior Developer',
  versionId: 'agent-senior-dev-v1',
  credentialId: 'freecode-agent-senior-dev-cred',
  credentialName: 'FreeCode API - agent-senior-dev',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-senior-dev-webhook',
  instanceId: 'narasim-dev-agent-senior-dev',
  model: process.env.AGENT_SENIOR_DEV_MODEL || 'anthropic/claude-opus-4.5',
  hasWorkflowOutput: true,
  canExecuteCode: isDevelopment,
  workflowInputs: [
    { name: 'chatInput', type: 'string' },
    { name: 'sessionId', type: 'string' },
    { name: 'user', type: 'object' },
  ],
})

export default [toolGraphqlRequest, agentWorkflow]
