import * as path from 'path'
import { createAgent } from '../agent-factory'

const AGENT_NAME = 'QA Engineer'
const isDevelopment = process.env.NODE_ENV === 'development'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'QA Engineer agent for testing, bug reporting, and quality assurance.',
  agentId: 'qa-engineer-agent',
  workflowName: 'Agent: QA Engineer',
  versionId: 'agent-qa-engineer-v1',
  credentialId: 'freecode-agent-qa-engineer-cred',
  credentialName: 'FreeCode API - agent-qa-engineer',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-qa-engineer-webhook',
  instanceId: 'narasim-dev-agent-qa-engineer',
  hasWorkflowOutput: true,
  canExecuteCode: isDevelopment,
  workflowInputs: [
    { name: 'chatInput', type: 'string' },
    { name: 'sessionId', type: 'string' },
    { name: 'user', type: 'object' },
  ],
})

export default [toolGraphqlRequest, agentWorkflow]
