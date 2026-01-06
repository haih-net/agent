import * as path from 'path'
import { createAgent } from '../agent-factory'

const AGENT_NAME = 'Tech Lead'
const isDevelopment = process.env.NODE_ENV === 'development'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'Tech Lead agent responsible for architectural decisions, code review, and technical mentorship.',
  agentId: 'techlead-agent',
  workflowName: 'Agent: Tech Lead',
  versionId: 'agent-techlead-v1',
  credentialId: 'freecode-agent-techlead-cred',
  credentialName: 'FreeCode API - agent-techlead',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-techlead-webhook',
  instanceId: 'narasim-dev-agent-techlead',
  model: 'anthropic/claude-opus-4',
  hasWorkflowOutput: true,
  canExecuteCode: isDevelopment,
  workflowInputs: [
    { name: 'chatInput', type: 'string' },
    { name: 'sessionId', type: 'string' },
    { name: 'user', type: 'object' },
  ],
})

export default [toolGraphqlRequest, agentWorkflow]
